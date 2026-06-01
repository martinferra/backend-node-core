const async = require('async')
const clone = require('lodash').clone
const mongoose = require('mongoose')

function saveChildrenInvoker(schema, obj) {
    return cb => schema.saveChildren(obj, cb)
}

function saveChildrenForArrayInvoker(schema, objArr) {
    return !objArr ? cb => cb(null, null) :
        cb => async.parallel(
            objArr.map(obj => saveChildrenInvoker(schema, obj)),
            (err, objArrRes) => cb(err, objArrRes)
        )
}

function saveDocumentInvoker(modelClassName, obj) {

    if (!obj || typeof obj === 'string' || obj.constructor.name === 'ObjectID') return cb => cb(null, obj)

    if (!modelClassName || modelClassName.indexOf('.') >= 0) {
        return cb => {
            cb(null, obj._id)
            return
        }
    }

    const modelClass = mongoose.model(modelClassName)
    return cb => modelClass.saveDocument(obj, async (err, doc) => {
        if (err) {
            console.error(new Error(`saveDocumentInvoker outer error, obj: ${obj}, modelClassName: ${modelClassName}`))
            console.error(err)
            cb(err, null)
            return
        }
        if (!doc) {
            let innerErr = new Error(`saveDocumentInvoker inner error, "doc" is undefined, obj: ${obj}, modelClassName: ${modelClassName}`)
            console.error(innerErr)
            cb(innerErr, doc)
            return
        }
        cb(err, doc._id)
        return
    })
}

function saveDocumentArrayInvoker(modelClassName, objArr) {
    return !objArr ? cb => cb(null, null) :
        cb => async.parallel(
            objArr.map(obj => saveDocumentInvoker(modelClassName, obj)),
            (err, objArrRes) => cb(err, objArrRes)
        )
}

function identityFnInvoker(obj) {
    return cb => cb(null, obj)
}

function globalPlugin(schema) {

    if (!schema.constructor.prototype.saveChildren) {
        schema.constructor.prototype.saveChildren = async function(obj, cb) {

            let resObj

            try {
                if (!obj) return

                let fnObj = {}

                for (let path in this.paths) {

                    if (!path || path === '__v' || !obj.hasOwnProperty(path)) continue

                    if (path === '_id') {
                        fnObj[path] = identityFnInvoker(obj[path])
                        continue
                    }

                    switch (this.paths[path].constructor.name) {
                    case 'SchemaSubdocument':
                        fnObj[path] = saveChildrenInvoker(this.paths[path].schema, obj[path])
                        break
                    case 'SchemaDocumentArray':
                        fnObj[path] = saveChildrenForArrayInvoker(this.paths[path].schema, obj[path])
                        break
                    case 'SchemaObjectId':
                        fnObj[path] = saveDocumentInvoker(this.tree[path].ref, obj[path])
                        break
                    case 'SchemaArray':
                        fnObj[path] = this.tree[path]?.[0]?.ref ?
                            saveDocumentArrayInvoker(this.tree[path][0].ref, obj[path]) :
                            identityFnInvoker(obj[path])
                        break
                    default:
                        fnObj[path] = identityFnInvoker(obj[path])
                        break
                    }
                }

                resObj = await async.parallel(fnObj)

                if (cb)
                    cb(null, resObj)
                else
                    return resObj
            } catch (e) {
                if (cb)
                    cb(e, resObj)
                else
                    throw e
            }
        }
    }

    schema.statics.saveDocument = async function(obj, cb) {

        let savedDoc, reducedObj

        try {
            if (typeof obj === 'string') {
                if (cb) cb(null, obj)
                return obj
            }

            if (
                obj.__t &&
                !this.modelName.endsWith(obj.__t) &&
                obj.__t !== this.modelName
            ) {
                let model = mongoose.models[this.modelName + ':' + obj.__t] ||
                    mongoose.models[obj.__t]
                savedDoc = await model.saveDocument(obj, null)
                if (cb) {
                    cb(null, savedDoc)
                    return
                } else {
                    return savedDoc
                }
            }

            this.getSingleSettingProperties().forEach(prop => {
                delete obj[prop]
            })

            reducedObj = await this.schema.saveChildren(obj)

            savedDoc = await this.findByUniqueKeysAndUpdate(reducedObj)

            if (cb)
                cb(null, savedDoc)
            else
                return savedDoc
        }
        catch (e) {
            if (cb)
                cb(e, savedDoc)
            else
                throw e
        }
    }

    schema.statics.findByUniqueKeys = async function(obj, cb) {

        let query = {}

        if (obj._id) {
            query._id = obj._id
        } else {
            let uniqueKeys = this.getUniqueKeys()
            uniqueKeys.forEach(key => {
                query[key] = obj[key]
            })
        }

        let existingDoc = await this.findOne(query)
        if (cb) cb(existingDoc)
        return existingDoc
    }

    schema.statics.findByUniqueKeysAndUpdate = async function(obj, cb) {

        let query,
            queryWithUniqueKeys = {},
            queryWithId = { _id: obj._id },
            dataToSave,
            dataWithUniqueKeys = clone(obj),
            dataWithOutUniqueKeys = clone(obj),
            savedDoc,
            uniqueKeys = this.getUniqueKeys(),
            hasUniqueKeys = !!uniqueKeys.length

        delete dataWithUniqueKeys._id
        delete dataWithOutUniqueKeys._id

        uniqueKeys.forEach(key => {
            delete dataWithOutUniqueKeys[key]
            queryWithUniqueKeys[key] = obj[key] !== undefined ? obj[key] : null
        })

        if (obj._id && !(hasUniqueKeys && this.useUniqueKeys)) {
            query = queryWithId
            dataToSave = dataWithUniqueKeys
        } else if (hasUniqueKeys) {
            query = queryWithUniqueKeys
            dataToSave = dataWithOutUniqueKeys
        } else {
            query = queryWithId
            dataToSave = dataWithUniqueKeys
        }

        savedDoc = await this.findOneAndUpdate(
            query,
            dataToSave,
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        )

        if (cb) cb(null, savedDoc)
        return savedDoc
    }

    schema.statics.getUniqueKeys = function() {
        const indexes = this.schema.indexes()
        return indexes
            .filter(idx => idx[1]?.unique)
            .map(idx => Object.keys(idx[0]))
            .flat()
    }

    schema.statics.getSingleSettingProperties = function() {
        const singleSettingPaths = []
        this.schema.eachPath((pathName, schemaType) => {
            if (schemaType.options?.singleSetting) {
                singleSettingPaths.push(pathName)
            }
        })
        return singleSettingPaths
    }
}

module.exports = globalPlugin