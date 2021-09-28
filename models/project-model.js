const { Schema, model } = require('mongoose');

const ProjectSchema = Schema({
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
  },
  additionalInfo: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  doors: {
    type: [Schema.Types.ObjectId],
    ref: 'Door',
  },
});

ProjectSchema.methods.toJSON = function () {
  const { __v, ...project } = this.toObject();
  return project;
}

module.exports = model('Project', ProjectSchema);