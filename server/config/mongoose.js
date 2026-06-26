const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

const config = require('@martinferra/config');
const globalPlugin = require('../config/mongoose.plugins');

// connect to mongo db
const mongoUri = config.mongo.host;
const mongoOptions =
  config.env === 'development'
    ? {
        serverSelectionTimeoutMS: 60000,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000,
      }
    : {};

mongoose.connect(mongoUri, mongoOptions);
mongoose.connection.on('error', error => {
  throw new Error(
    `unable to connect to database: ${mongoUri}. Error: ${error}`
  );
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

mongoose.plugin(globalPlugin);
