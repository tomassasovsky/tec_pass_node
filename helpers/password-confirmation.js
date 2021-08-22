const passwordConfirmation = async (value, { req }) => {
  const { passwordConfirmation } = req.body;
  if (value !== passwordConfirmation) {
    throw new Error('· Las contraseñas no coinciden');
  }
}

module.exports = {
  passwordConfirmation
}