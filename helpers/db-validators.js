const User = require('../models/user-model')

const emailExists = async (email = '') => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error('This email is already registered');
  }
}

const userExists = async (id = '') => {
  const exists = await User.findById(id);
  if (!exists) {
    throw new Error('This user doesn\'t exist');
  }
}

module.exports = {
  emailExists,
  userExists,
}