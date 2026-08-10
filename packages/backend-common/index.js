require('./models/registration-req.model');
require('./models/log-message.model');

module.exports = {
    config: {
        email: require('./config/email'),
        serverProcesses: require('./config/server-processes'),
        subscriptions: require('./config/subscriptions'),
        websocketCallbacks: require('./config/websocket-callbacks'),
        websockets: require('./config/websockets')
    },
    controllers: {
        auth: require('./controllers/auth.controller'),
        controllerFactory: require('./controllers/controller.factory'),
        reports: require('./controllers/reports.controller'),
        registrationReq: require('./controllers/registration-req.controller'),
        sharedConfig: require('./controllers/shared-config.controller'),
        user: require('./controllers/user.controller')
    },
    middleware: {
        requireAdmin: require('./middleware/require-admin')
    },
    models: {
        modelFactory: require('./models/model.factory'),
        logMessage: require('./models/log-message.model'),
        registrationReq: require('./models/registration-req.model'),
        user: require('./models/user.model')
    },
    routes: {
        routerFactory: require('./routes/router.factory')
    },
    reports: {
        reportsDefinitions: require('./reports/reports-definitions')
    },
    schemas: {
        registrationReqSchema: require('./schemas/registration-req.schema'),
        userSchema: require('./schemas/user.schema')
    },
    commonFunctions: require('./commonFunctions'),
    
};
