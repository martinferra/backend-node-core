const Joi = require('joi');

const CostCenterSchema = Joi.object({
  _id: Joi.string().allow(null),
  name: Joi.string().required(),
  totalCost: Joi.number().required(),
});

module.exports = CostCenterSchema;
