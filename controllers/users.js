const { response } = require('express');

const usersGet = (req = request, res = response) => {
  const query = req.query;
  const { q, name, apiKey } = query;
  res.status(200).json({
    message: 'GET API - USERS',
    q,
    name,
    apiKey
  })
}

const usersPost = (req, res = response) => {
  const { name, age, id, lastname } = req.body;

  res.json({
    message: 'POST API - USERS',
    name,
    age,
    id,
    lastname
  })
}

const usersPut = (req, res = response) => {
  const { id } = req.params;
  res.status(200).json({
    message: 'PUT API - USERS',
    id
  })
}

const usersDelete = (req, res = response) => {
  res.status(200).json({
    message: 'DELETE API - USERS'
  })
}

const usersPatch = (req, res = response) => {
  res.status(200).json({
    message: 'PATCH API - USERS'
  })
}

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
  usersPatch
}