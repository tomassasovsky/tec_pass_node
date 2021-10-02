const { request, response } = require('express')
const bcryptjs = require('bcryptjs');

const User = require('../models/user-model');
const { buildError, signRefreshToken, signAccessToken } = require('../helpers/helpers');

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).send(buildError('· El correo no está registrado', 'email'));
    if (!user.status) return res.status(401).send(buildError('· El usuario ha sido desactivado', 'email'));

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) return res.status(401).send(buildError('· La contraseña es incorrecta', 'password'));

    const refreshToken = await signRefreshToken(user._id);
    const accessToken = await signAccessToken(user._id);

    if (!refreshToken) return res.status(500).send(buildError('· El refreshToken no se ha podido generar', 'server'));
    if (!accessToken) return res.status(500).send(buildError('· El refreshToken no se ha podido generar', 'server'));

    res.status(200).json({
      user,
      refreshToken,
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(buildError('· Algo salió mal', 'server'));
  }
}

const logout = async (req = request, res = response) => {
  const { refreshToken } = req;

  try {
    await refreshToken.delete();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(500).send(buildError('· Algo salió mal', 'server'));
  }
}

const token = async (req = request, res = response) => {
  const { refreshToken } = req;

  try {
    const accessToken = await signAccessToken(refreshToken.user);

    if (!accessToken) return res.status(401).send(buildError('· El token de acceso no se ha podido generar', 'refreshToken'));

    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).send(buildError('· Algo salió mal', 'refreshToken'));
  }
}

module.exports = {
  login,
  logout,
  token,
}