const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio y no debe estar usado'],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es obligatorio y no debe estar usado'],
    unique: true,
  },
  rut: {
    type: String,
    required: [true, 'El RUT es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  image: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
}

module.exports = model('User', UserSchema);