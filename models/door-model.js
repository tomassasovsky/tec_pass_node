const { Schema, model } = require("mongoose");

const DoorSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre de la puerta es necesario para que el usuario pueda diferenciarla"],
  },
  description: {
    type: String,
  },
  deviceId: {
    type: String,
    required: [true, "El identificador del dispositivo es obligatorio"],
    required: true,
  },
  accessType: {
    type: String,
    required: [true, "El tipo de acceso (WALK, BIKE, CAR) es requerido"],
    enum: ["WALK", "BIKE", "CAR"],
  },
  places: {
    type: [Schema.Types.ObjectId],
    ref: "Place",
    required: [true, "Esta puerta debe pertenecer a un lugar"],
  },
});

DoorSchema.methods.toJSON = function () {
  const { __v, ...door } = this.toObject();
  return door;
}

module.exports = model('Door', DoorSchema);