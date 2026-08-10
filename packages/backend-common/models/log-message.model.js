const mongoose = require('mongoose');
const modelFactory = require('./model.factory');

// Capped collection limits (env vars with defaults)
const LOG_MAX_SIZE = parseInt(process.env.LOG_MAX_SIZE, 10) || 1048576;
const LOG_MAX_ENTRIES = parseInt(process.env.LOG_MAX_ENTRIES, 10) || 1000;

const LogMessageSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['log', 'warning', 'error'], default: 'log' },
    message: String,
  },
  {
    capped: {
      size: LOG_MAX_SIZE,
      max: LOG_MAX_ENTRIES,
    },
  }
);

const LogMessage = modelFactory.registerModelSchema('LogMessage', LogMessageSchema);

async function logMessage(type, message) {
  const model = modelFactory.getModel('LogMessage');
  return model.create({ type, message });
}

module.exports = {
  LogMessage,
  logMessage,
};
