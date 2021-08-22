const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user-model')

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      errors: [
        {
          msg: 'El token es obligatorio',
          param: 'token',
        }
      ],
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        errors: [
          {
            msg: 'El usuario no existe'
          }
        ],
      })
    }

    if (!user.status) {
      return res.status(401).json({
        errors: [
          {
            msg: 'El usuario está desactivado',
          }
        ],
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      errors: [
        {
          msg: 'El token no es válido',
          param: 'token',
        },
      ],
    });
  }
}

module.exports = {
  validateJWT,
}