const modelFactory = require('../models/model.factory');
const ProductFamilyModel = modelFactory.getModel('ProductFamily');
const ProductFamilySchema = require('../schemas/product-family.schema');
const controllerFactory = require('./controller.factory');

async function save(data) {
  const innerFn = controllerFactory.getCtrlSaveFn(ProductFamilySchema);
  return await innerFn(ProductFamilyModel, data);
}

module.exports = {
  save,
};
