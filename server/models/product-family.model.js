const mongoose = require('mongoose');
const modelFactory = require('./model.factory');

const ProductFamilySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  variableCost: {
    type: Number,
    required: true,
  },
  projectedQ: {
    type: Number,
    required: true,
  },
  costCentersUsage: [
    {
      costCenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CostCenter',
        required: true,
      },
      usagePercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },
  ],
});

modelFactory.registerModelSchema('ProductFamily', ProductFamilySchema);
