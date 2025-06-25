const Joi = require('joi');

const ProductFamilySchema = Joi.object({
  _id: Joi.string().allow(null),
  name: Joi.string().required(),
  price: Joi.number().required(),
  variableCost: Joi.number().required(),
  projectedQ: Joi.number().required(),
  costCentersUsage: Joi.array().items(
    Joi.object({
      costCenter: Joi.string().required(),
      usagePercentage: Joi.number().min(0).max(100).required(),
    })
  ),
});

module.exports = ProductFamilySchema;
