const { request, response } = require("express");


const passwordConfirmation = async (req = request, res = response, next) => {
  const { password, passwordConfirmation } = req.body;

  if (password !== passwordConfirmation) {
    throw new Error('· Las contraseñas no coinciden');
  }

  next();
}

module.exports = {
  passwordConfirmation
}