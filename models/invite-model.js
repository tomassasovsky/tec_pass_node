const { Schema, model } = require("mongoose");

const InviteSchema = Schema({
  active: {
    type: Boolean,
    default: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  to: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'User',
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
  },
  dateFrom: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  dateTo: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  pushId: {
    type: String,
  },
}, {
  timestamps: true,
});

InviteSchema.methods.toJSON = function () {
  const { __v, ...invite } = this.toObject();
  return invite;
}

module.exports = model('Invite', InviteSchema);