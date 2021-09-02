const { Schema, model } = require("mongoose");

const PlaceSchema = Schema({
  query: {
    type: String,
    required: true
  },
  floor: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
});

PlaceSchema.methods.toJSON = function () {
  const { __v, _id, ...place } = this.toObject();
  place.id = _id;
  return place;
}

module.exports = model('Place', PlaceSchema);