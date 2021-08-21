const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user-model');

const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 1 } = req.query;
  const query = { status: true };

  const [count, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from) - 1).limit(Number(limit))
  ]);

  res.json({ count, users });
}

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // hash password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(user.password, salt);

  // save on database
  await user.save();

  res.json({ user })
}

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...newData } = req.body;

  // TODO: validate with db
  if (password) {
    // hash password
    const salt = bcryptjs.genSaltSync();
    newData.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, newData);

  res.status(200).json(user)
}

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { status: false });
  const authenticatedUser = req.user;

  res.status(200).json({ user });
}

const usersPatch = (req = request, res = response) => {
  res.status(200).json({})
}

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch
}