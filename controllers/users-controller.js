const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user-model');
const { buildError, signAccessToken, signRefreshToken } = require('../helpers/helpers');

const usersGet = async (req = request, res = response) => {
  const user = req.user;
  res.json({ user });
}

const usersPost = async (req = request, res = response) => {
  const { name, email, phone, rut, password } = req.body;
  const user = new User({ name, email, phone, rut, password });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(user.password, salt);

  await user.save();

  const refreshToken = await signRefreshToken(user._id);
  const accessToken = await signAccessToken(user._id);

  res.json({ user, refreshToken, accessToken })
}

const usersPut = async (req = request, res = response) => {
  const { password, email, projects, rut, ...newData } = req.body;
  const { user } = req;

  Object.assign(user, newData);
  await user.save();
  
  await user.populate('projects').execPopulate();

  res.status(200).json({ user })
}

const usersDelete = async (req = request, res = response) => {
  const { user } = req;

  user.status = false;
  await user.save();

  res.status(200).json({ user });
}

const usersPatch = async (req = request, res = response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json(buildError('· No se ha encontrado un usuario con este correo', 'email'))

  const validPassword = bcryptjs.compareSync(password, user.password);
  if (!validPassword) return res.status(403).json(buildError('· La contraseña es incorrecta', 'password'))

  user.status = true;
  await user.save();

  res.status(200).json({ user });
}

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch
}