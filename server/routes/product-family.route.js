const { getRouterByModel } = require('./router.factory');
const productFamilySchema = require('../schemas/product-family.schema');

const productFamilyRoutes = getRouterByModel('ProductFamily', productFamilySchema);

module.exports = productFamilyRoutes;
