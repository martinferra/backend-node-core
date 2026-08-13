const mongoose = require('mongoose');
const subscriptions = require('../config/subscriptions');

var modelSchemas = new Map();
var modelPostCreation = new Map();

function registerModelSchema(name, schema) {
    modelSchemas.set(name, schema);
    addMiddleware(schema);
    if(
        !schema.statics.useDiscriminators && 
        !schema.statics.useSubClassDiscriminators
    ) {
        return getModel(name);
    }
    return;
}

function registerModelPostCreation(name, fn) {
    var fnOrArray = modelPostCreation.get(name);
    if(fnOrArray) {
        if(fnOrArray instanceof Array) {
            fnOrArray.push(fn);
        } else {
            modelPostCreation.set(name, [fn, fnOrArray]);
        }
    } else {
        modelPostCreation.set(name, fn);
    }
}

function registerModelDiscriminator(name, schema, discriminator) {
    registerModelPostCreation(
        name, 
        model=>model.discriminator(model.modelName+':'+discriminator, schema, discriminator)
    )
}

function addMiddlewareEntry(schema, innerMethod, outerMethod) {
    schema.post(innerMethod, function (doc) {
        var modelId;
        if (doc.constructor.useDiscriminators) {
            /* The last underscore in the collection name is the one that 
            separates the model name from the discriminator name, so we 
            replace it with a slash to get the modelId. */
            modelId = doc.constructor.collection.name.replace(/_(?=[^_]*$)/, '/');
        } else {
            modelId = doc.constructor.modelName.toLowerCase();
        }
        const resolvedOuterMethod = typeof outerMethod === 'function' ? outerMethod(doc) : outerMethod;
        const path = `${modelId}/${resolvedOuterMethod}/${doc._id.toString()}`;
        const plainObj = doc.toObject();
        plainObj._id = plainObj._id.toString();
        subscriptions.publish(path, plainObj);
    });
};

function addMiddleware(schema) {
    schema.pre('save', function () {
        this._wasNew = this.isNew;
    });
    addMiddlewareEntry(schema, 'save', (doc) => doc._wasNew ? 'new' : 'update');
    addMiddlewareEntry(schema, 'findOneAndUpdate', 'update');
    addMiddlewareEntry(schema, 'findOneAndRemove', 'remove');
};

function getModel(name, discriminator) {
    const fullName = name + (discriminator? '_' + discriminator : '');
    const models = mongoose.modelNames();
    let model;
    if(models.find(m=>m===fullName)) {
        model = mongoose.model(fullName);
    } else {
        let schema = modelSchemas.get(name);
        if(schema) {
            model = mongoose.model(fullName, schema, discriminator? fullName.toLowerCase(): undefined);
            let modelPostCreationFn = modelPostCreation.get(name);
            if(modelPostCreationFn) {
                if(modelPostCreationFn instanceof Array) {
                    modelPostCreationFn.forEach(fn=>fn(model));
                } else {
                    modelPostCreationFn(model);
                }
            }
        } else {
            throw new Error(`Model schema doesn't exist for model name '${name}'`);
        }
    }
    return model;
}

module.exports = {
    registerModelSchema, 
    registerModelPostCreation, 
    registerModelDiscriminator,
    getModel
}