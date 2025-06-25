const modelFactory = require('../models/model.factory');
const CostCenterModel = modelFactory.getModel('CostCenter');
const CostCenterSchema = require('../schemas/cost-center.schema');
const controllerFactory = require('./controller.factory');

async function save(data) {
  const innerFn = controllerFactory.getCtrlSaveFn(CostCenterSchema);
  return await innerFn(CostCenterModel, data);
}

module.exports = {
  save,
};
