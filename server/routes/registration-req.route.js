const { getRouterByModel } = require('@martinferra/backend-common').routes.routerFactory;
const registrationReqSchema = require('@martinferra/backend-common').schemas.registrationReqSchema;

const registrationReqRoutes = getRouterByModel(
  'RegistrationReq',
  registrationReqSchema
);

module.exports = registrationReqRoutes;
