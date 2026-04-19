// config should be imported before importing any other file
const config = require('@martinferra/config');
require('./required');
const app = require('./config/express');
const serverProcs = require('@martinferra/backend-common').config.serverProcesses;

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  const port = process.env.PORT || config.port;
  const server = app.listen(port, () => {
    console.info(`server started on port ${port} (${config.env})`);
  });
  serverProcs.init(server);
}