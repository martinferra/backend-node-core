const { getRouterByModel } = require('./router.factory');
const userSchema = require('../schemas/user.schema');
const userCtrl = require('../controllers/user.controller');
const requireAdmin = require('../middleware/require-admin');
const asyncHandler = require('express-async-handler');
const modelFactory = require('../models/model.factory');

function setCustomRoutes(router) {
    router.route('/findAutocompleteOptions').post(requireAdmin, asyncHandler(findAutocompleteOptions));
}

async function findAutocompleteOptions(req, res) {
  const model = modelFactory.getModel('User');
  const users = await userCtrl.findAutocompleteOptions(model, req.body);
  res.json(users);
}

const customUserRoutes = {setCustomRoutes};

const userRoutes = getRouterByModel('User', userSchema, customUserRoutes);

module.exports = userRoutes;
