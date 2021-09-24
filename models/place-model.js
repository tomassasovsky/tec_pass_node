const { Schema, model } = require("mongoose");

const PlaceSchema = Schema({
  address: {
    type: String,
    required: [true, "La dirección es obligatoria"],
  },
  floor: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  }
});

PlaceSchema.methods.toJSON = function () {
  const { __v, ...place } = this.toObject();
  return place;
}

module.exports = model('Place', PlaceSchema);