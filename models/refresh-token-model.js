const { Schema, model } = require("mongoose");

const RefreshTokenSchema = Schema({
  token: {
    type: String,
    required: true,
    unique: true
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

RefreshTokenSchema.methods.toJSON = function () {
  const { __v, _id, ...refreshToken } = this.toObject();
  refreshToken.uid = _id;
  return refreshToken;
}

module.exports = model('RefreshToken', RefreshTokenSchema);