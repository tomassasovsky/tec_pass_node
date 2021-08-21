const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '4h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        return reject('Unable to generate token')
      }

      return resolve(token)
    })
  });
}

module.exports = {
  generateJWT
}