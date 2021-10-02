const { Schema, model } = require('mongoose');
const User = require('./user-model');

const RefreshTokenSchema = Schema({
  token: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports = model('RefreshToken', RefreshTokenSchema);