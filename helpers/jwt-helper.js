const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const { Schema } = require('mongoose');

const RefreshToken = require('../models/refresh-token-model');
const User = require('../models/user-model');

const { buildError } = require('./build-error');

const signAccessToken = (uid = Schema.Types.ObjectId) => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' }, (err, token) => {
      if (err) return reject('No se ha podido generar su credencial')

      return resolve(token)
    })
  })
}

const signRefreshToken = (user = User) => {
  return new Promise(async (resolve, reject) => {
    if (!user) reject('El usuario no existe')

    jwt.sign({ uid: user._id }, process.env.REFRESH_TOKEN_SECRET, async (err, token) => {
      if (err) return reject('No se ha podido generar su credencial')

      try {

        const refreshToken = new RefreshToken({ token, user })
        await refreshToken.save()

      } catch (error) {
        console.log(error)
      }

      return resolve(token)
    })
  })
}

const verifyRefreshToken = async (req = request, res = response, next) => {
  const auth = req.header('Authorization')
  if (!auth) return res.status(401).json(buildError('· El token es obligatorio', 'token'))

  const parts = auth.split(' ')
  if (!parts) return res.status(401).json(buildError('· El token es obligatorio', 'token'))

  const token = parts[1]
  if (!token) return res.status(401).json(buildError('· El token es obligatorio', 'token'))

  try {
    const { uid } = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const refreshToken = await RefreshToken.findOne({ token });

    if (!refreshToken) return res.status(403).json(buildError('· El token no está registrado', 'token'))
    if (!refreshToken.status) return res.status(403).json(buildError('· El token ha sido desactivado', 'token'))

    req.refreshToken = refreshToken;

    const user = await User.findById(uid);

    if (!user) return res.status(401).json(buildError('· El usuario no existe', 'email'))
    if (!user.status) return res.status(401).json(buildError('· El usuario está desactivado', 'email'))

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json(buildError('· El token no es válido', 'token'))
  }
}

const verifyAccessToken = async (req, res, next) => {
  const auth = req.header('Authorization')
  if (!auth) return res.status(401).json(buildError('· El token es obligatorio', 'token'))

  const parts = auth.split(' ')
  if (!parts) return res.status(401).json(buildError('· El token es obligatorio', 'token'))

  const token = parts[1]
  if (!token) return res.status(401).json(buildError('· El token es obligatorio', 'token'))

  try {
    const { uid } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(uid);

    if (!user) return res.status(401).json(buildError('· El usuario no existe', 'email'))
    if (!user.status) return res.status(401).json(buildError('· El usuario está desactivado', 'email'))

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json(buildError('· El token no es válido', 'token'))
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken
}