const config = require('@martinferra/config');

function getSharedConfig() {
  return {
    allowUserRegistration: config.allowUserRegistration,
  };
}

module.exports = {
  getSharedConfig,
};
