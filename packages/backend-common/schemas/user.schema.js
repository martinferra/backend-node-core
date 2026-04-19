const Joi = require('joi');

const UserSchema = Joi.object({
  _id: Joi.string().allow(null),
  fullname: Joi.string().when('_id', { is: null, then: Joi.required() }),
  email: Joi.string().email().when('_id', { is: null, then: Joi.required() }),
  mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/),
  password: Joi.string()
    .allow(null)
    .when('_id', { is: null, then: Joi.required() }),
  repeatPassword: Joi.string()
    .allow(null)
    .when('_id', { is: null, then: Joi.required() }),
  roles: Joi.array().items(String),
});

module.exports = UserSchema;
