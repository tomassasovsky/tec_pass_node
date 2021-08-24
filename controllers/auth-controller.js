const { request, response } = require("express")
const bcryptjs = require("bcryptjs");

const User = require("../models/user-model");
const RefreshToken = require("../models/refresh-token-model");

const { buildError, signRefreshToken, signAccessToken } = require("../helpers/helpers");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).send(buildError('El correo no está registrado', 'email'));
    if (!user.status) return res.status(401).send(buildError('El usuario ha sido desactivado', 'email'));

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) return res.status(401).send(buildError('La contraseña es incorrecta', 'password'));

    const refreshToken = await signRefreshToken(user._id);
    const accessToken = await signAccessToken(user._id);

    if (!refreshToken) return res.status(401).send(buildError('El token de refresco no se ha podido generar', 'password'));
    if (!accessToken) return res.status(401).send(buildError('El token de acceso no se ha podido generar', 'password'));

    res.status(200).json({
      refreshToken,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(buildError('Algo salió mal', 'email'));
  }
}

const token = async (req = request, res = response) => {
  const refreshToken = req.header('Authorization').split(' ')[1]

  try {
    const token = await RefreshToken.findOne({ token: refreshToken });

    if (!token) return res.status(401).send(buildError('El token de refresco no está registrado', 'refreshToken'));
    if (!token.status) return res.status(403).send(buildError('La autenticación no está permitida con este token', 'refreshToken'));

    const accessToken = await signAccessToken(token.user);

    if (!accessToken) return res.status(401).send(buildError('El token de acceso no se ha podido generar', 'refreshToken'));

    res.status(200).json({
      accessToken,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send(buildError('Algo salió mal', 'refreshToken'));
  }
}

module.exports = {
  login,
  token,
}