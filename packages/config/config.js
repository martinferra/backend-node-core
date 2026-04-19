const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  SERVER_PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  MEAN_FRONTEND: Joi.string().default('angular'),
  TIMEZONE_OFFSET: Joi.number().default(new Date().getTimezoneOffset()),
  MONGO_HOST: Joi.string().required().description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  DB_TIME_WINDOW: Joi.number().default(7),
  DB_CLEANING_INTERVAL: Joi.number().default(1),
  EMAIL_SMTP_ALARMS_HOST: Joi.string().description('SMTP host for alarms'),
  EMAIL_SMTP_ALARMS_PORT: Joi.number().default(465),
  EMAIL_SMTP_ALARMS_SECURE: Joi.boolean().default(true),
  EMAIL_SMTP_ALARMS_AUTH_USER: Joi.string().description('SMTP auth user for alarms'),
  EMAIL_SMTP_ALARMS_AUTH_PASS: Joi.string().description('SMTP auth pass for alarms'),
  EMAIL_SMTP_DEFAULT_HOST: Joi.string().description('SMTP host for default'),
  EMAIL_SMTP_DEFAULT_PORT: Joi.number().description('SMTP port for default'),
  EMAIL_SMTP_DEFAULT_SECURE: Joi.boolean().description('SMTP secure for default'),
  EMAIL_SMTP_DEFAULT_AUTH_USER: Joi.string().description('SMTP auth user for default'),
  EMAIL_SMTP_DEFAULT_AUTH_PASS: Joi.string().description('SMTP auth pass for default'),
  BS_PORT: Joi.number().default(3000),
  ALLOW_USER_REGISTRATION: Joi.boolean().default(false),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  frontend: envVars.MEAN_FRONTEND,
  timeZoneOffset: envVars.TIMEZONE_OFFSET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
  },
  db: {
    timeWindow: envVars.DB_TIME_WINDOW,
    cleaningInterval: envVars.DB_CLEANING_INTERVAL,
  },
  email: {
    smtp: {
      default: {
        host: envVars.EMAIL_SMTP_ALARMS_HOST,
        port: envVars.EMAIL_SMTP_ALARMS_PORT || 465,
        secure: envVars.EMAIL_SMTP_ALARMS_SECURE || true,
        auth: {
          user: envVars.EMAIL_SMTP_ALARMS_AUTH_USER,
          pass: envVars.EMAIL_SMTP_ALARMS_AUTH_PASS,
        },
      },
      alarms: {
        host: envVars.EMAIL_SMTP_DEFAULT_HOST || envVars.EMAIL_SMTP_ALARMS_HOST,
        port: envVars.EMAIL_SMTP_DEFAULT_PORT || envVars.EMAIL_SMTP_ALARMS_PORT,
        secure:
          envVars.EMAIL_SMTP_DEFAULT_SECURE || envVars.EMAIL_SMTP_ALARMS_SECURE,
        auth: {
          user:
            envVars.EMAIL_SMTP_DEFAULT_AUTH_USER ||
            envVars.EMAIL_SMTP_ALARMS_AUTH_USER,
          pass:
            envVars.EMAIL_SMTP_DEFAULT_AUTH_PASS ||
            envVars.EMAIL_SMTP_ALARMS_AUTH_PASS,
        },
      },
    },
  },
  allowUserRegistration: envVars.ALLOW_USER_REGISTRATION,
  browserSync: {
    port: envVars.BS_PORT
  }
};

module.exports = config;
