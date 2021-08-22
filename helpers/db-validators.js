const User = require('../models/user-model')

const emailExists = async (email = '') => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error('Este correo ya tiene una cuenta vinculada');
  }
}

const userExists = async (id = '') => {
  const exists = await User.findById(id);
  if (!exists) {
    throw new Error('Este usuario no existe');
  }
}

module.exports = {
  emailExists,
  userExists,
}