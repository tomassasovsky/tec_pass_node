const { validateRut } = require("@cksharma11/rut-validator");

const rutValid = async (rut = '') => {
  const isValid = validateRut(rut);
  if (!isValid) {
    throw new Error('El RUT no es válido');
  }
}

module.exports = { rutValid }
