const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user-model');
const { buildError, signAccessToken, signRefreshToken } = require('../helpers/helpers');

const usersGet = async (req = request, res = response) => {
  const user = req.user;
  res.json(User);
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
  const { _id, ...newData } = req.body;

  const user = await User.findByIdAndUpdate(req.user._id, newData);

  res.status(200).json(user)
}

const usersDelete = async (req = request, res = response) => {
  const user = await User.findByIdAndUpdate(req.user.id, { status: false });

  res.status(200).json(user);
}

const usersPatch = async (req = request, res = response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json(buildError('No se ha encontrado un usuario con este correo', 'email'))

  const validPassword = bcryptjs.compareSync(password, user.password);
  if (!validPassword) return res.status(403).json(buildError('La contraseña es incorrecta', 'password'))

  const updatedUser = await User.findOneAndUpdate({ email }, { status: true });

  res.status(200).json(updatedUser);
}

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch
}