const { Schema, model } = require("mongoose");

const ProjectSchema = Schema({
  address: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String,
  },
  places: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Place'
    },
  ]
});

ProjectSchema.methods.toJSON = function () {
  const { __v, _id, ...project } = this.toObject();
  project.id = _id;
  return project;
}

module.exports = model('Project', ProjectSchema);