const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const UserSchema = require('../schemas/user.schema');
const commonFunctions = require('../../common/commonFunctions');

async function findAutocompleteOptions(model, queryData) {
  const terms = commonFunctions.getRegEx(queryData.queryStr)
  const filter = { 
      $or: [
        { fullname: { $regex: terms, $options: 'i' } },
        { email: { $regex: terms, $options: 'i' } }
      ]
  }
  const projection = 'fullname email'
  return await model.find(filter, projection);
}

async function insert(userPlainObj) {
  let validation = UserSchema.validate(userPlainObj, { abortEarly: false });
  if (validation.error) {
    console.error(validation.error);
    return validation.error;
  }
  userPlainObj.hashedPassword = bcrypt.hashSync(userPlainObj.password, 10);
  delete userPlainObj.password;
  return await new User(userPlainObj).save();
}

async function checkUser(email) {
  let user = await User.findOne({ email });
  if (user) {
    user = user.toObject();
    return {
      exists: true,
      fullname: user.fullname,
      blankedPassword: !user.hashedPassword,
    };
  } else {
    return {
      exists: false,
    };
  }
}

module.exports = {
  insert,
  checkUser,
  findAutocompleteOptions
};
