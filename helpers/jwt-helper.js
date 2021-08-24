const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const RefreshToken = require('../models/refresh-token-model');
const User = require('../models/user-model');

const { buildError } = require('./build-error');

const signAccessToken = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' }, (err, token) => {
      if (err) return reject('No se ha podido generar su credencial')

      return resolve(token)
    })
  })
}

const signRefreshToken = (uid = '') => {
  return new Promise(async (resolve, reject) => {
    const userDB = await User.findById(uid);
    if (!userDB) reject('El usuario no existe')

    jwt.sign({ uid }, process.env.REFRESH_TOKEN_SECRET, async (err, token) => {
      if (err) return reject('No se ha podido generar su credencial')

      const user = mongoose.Types.ObjectId(uid)

      const refreshToken = new RefreshToken({ token, user })
      await refreshToken.save()

      return resolve(token)
    })
  })
}

const verifyRefreshToken = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1]

  if (!token) {
    return res.status(401).json(buildError('El token es obligatorio', 'token'))
  }

  try {
    const { uid } = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const dbToken = await RefreshToken.findOne({ token });

    if (!dbToken) {
      return res.status(401).json(buildError('El token es obligatorio', 'token'))
    }

    if (!dbToken.status) {
      return res.status(403).json(buildError('El token ha sido desactivado', 'token'))
    }

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json(buildError('El usuario no existe', 'email'))
    }

    if (!user.status) {
      return res.status(401).json(buildError('El usuario está desactivado', 'email'))
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json(buildError('El token no es válido', 'token'))
  }
}

const verifyAccessToken = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1]

  if (!token) {
    return res.status(401).json(buildError('El token es obligatorio', 'token'))
  }

  try {
    const { uid } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json(buildError('El usuario no existe', 'email'))
    }

    if (!user.status) {
      return res.status(401).json(buildError('El usuario está desactivado', 'email'))
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json(buildError('El token no es válido', 'token'))
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}