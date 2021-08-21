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
        message: "Email is not registered"
      });
    }

    if (!user.status) {
      return res.status(400).send({
        message: "This user has been disabled"
      });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).send({
        message: "The password is not correct"
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Something went wrong"
    });
  }
}

module.exports = {
  login
}