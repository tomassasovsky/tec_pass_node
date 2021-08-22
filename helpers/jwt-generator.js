const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '180d'
    }, (err, token) => {
      if (err) {
        console.log(err);
        return reject('No se ha podido generar su credencial')
      }

      return resolve(token)
    })
  });
}

module.exports = {
  generateJWT
}