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

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) return res.status(401).send(buildError('La contraseña es incorrecta', 'password'));

    const refreshToken = await signRefreshToken(user._id);
    const accessToken = await signAccessToken(user._id);

    if (!refreshToken) return res.status(401).send(buildError('El token de refresco no se ha podido generar', 'password'));
    if (!accessToken) return res.status(401).send(buildError('El token de acceso no se ha podido generar', 'password'));

    res.status(200).json({
      user,
      refreshToken,
      accessToken,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send(buildError('Algo salió mal', 'email'));
  }
}

const logout = async (req = request, res = response) => {
  const token = req.header('Authorization').split(' ')[1]

  try {
    const result = await RefreshToken.findOneAndDelete({ token }).populate("user");
    if (!result) return res.status(401).send(buildError('El token de refresco no está registrado', 'refreshToken'));

    const user = result.user.toJSON();
    const object = result.toObject();

    object.id = object._id
    object.user = user
    delete object._id
    delete object.__v

    res.status(200).json(object);
  } catch (err) {
    console.log(err);
    return res.status(500).send(buildError('Algo salió mal', 'refreshToken'));
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
  logout,
  token,
}