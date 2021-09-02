const { Schema, model } = require("mongoose");

const InviteSchema = Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
  },
  dateFrom: {
    type: Date,
  },
  dateTo: {
    type: Date,
  },
  message: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  received: {
    type: Boolean,
    default: false,
  },
});

InviteSchema.methods.toJSON = function () {
  const { __v, _id, ...invite } = this.toObject();
  invite.id = _id;
  return invite;
}

module.exports = model('Invite', InviteSchema);