const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'The name is required'],
  },
  email: {
    type: String,
    required: [true, 'The email is required and must be unique'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
}

module.exports = model('User', UserSchema);