const mongoose = require('mongoose');
const RegExDefs = require('../../common/regex-defs');

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [RegExDefs.email, 'Formato de correo electrónico incorrecto'],
    },
    hashedPassword: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    roles: [
      {
        type: String,
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('User', UserSchema);
