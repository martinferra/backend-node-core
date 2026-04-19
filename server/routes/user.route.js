const { getRouterByModel } = require('@martinferra/backend-common').routes.routerFactory;
const userSchema = require('@martinferra/backend-common').schemas.userSchema;
const userCtrl = require('@martinferra/backend-common').controllers.user;
const requireAdmin = require('@martinferra/backend-common').middleware.requireAdmin;
const asyncHandler = require('express-async-handler');
const modelFactory = require('@martinferra/backend-common').models.modelFactory;

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
