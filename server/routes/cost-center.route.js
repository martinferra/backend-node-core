const { getRouterByModel } = require('./router.factory');
const costCenterSchema = require('../schemas/cost-center.schema');

const costCenterRoutes = getRouterByModel('CostCenter', costCenterSchema);

module.exports = costCenterRoutes;
