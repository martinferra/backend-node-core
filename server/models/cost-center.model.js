const mongoose = require('mongoose');
const modelFactory = require('./model.factory');

const CostCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
});

modelFactory.registerModelSchema('CostCenter', CostCenterSchema);
