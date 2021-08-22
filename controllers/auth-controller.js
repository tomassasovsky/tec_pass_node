const { request, response } = require("express")
const bcryptjs = require("bcryptjs");

const User = require("../models/user-model");
const { generateJWT } = require("../helpers/jwt-generator");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({
        message: "El correo no está registrado"
      });
    }

    if (!user.status) {
      return res.status(400).send({
        message: "El usuario ha sido desactivado"
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).send({
        message: "La contraseña es incorrecta"
      });
    }

    const token = await generateJWT(user.id);

    res.status(200).json({
      user,
      token,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Algo salió mal"
    });
  }
}

module.exports = {
  login
}