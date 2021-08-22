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
        errors: [
          {
            msg: "El correo no está registrado",
            param: "email",
          },
        ],
      });
    }

    if (!user.status) {
      return res.status(400).send({
        errors: [
          {
            msg: "El usuario ha sido desactivado",
          },
        ],
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).send({
        errors: [
          {
            msg: "La contraseña es incorrecta",
            param: "password",
          },
        ],
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
      errors: [
        {
          msg: "Algo salió mal",
        },
      ],
    });
  }
}

module.exports = {
  login
}