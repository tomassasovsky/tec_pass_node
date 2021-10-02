const { Schema, model } = require('mongoose');

const DoorSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la puerta es necesario para que el usuario pueda diferenciarla'],
  },
  description: {
    type: String,
  },
  deviceId: {
    type: String,
    required: [true, 'El identificador del dispositivo es obligatorio'],
  },
  accessType: {
    type: String,
    required: [true, 'El tipo de acceso (WALK, BIKE, CAR) es requerido'],
    enum: ['WALK', 'BIKE', 'CAR'],
  },
  floor: {
    type: String,
  },
});

DoorSchema.methods.toJSON = function () {
  const { __v, ...door } = this.toObject();
  return door;
}

module.exports = model('Door', DoorSchema);