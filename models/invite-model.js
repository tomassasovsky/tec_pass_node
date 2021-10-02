const { Schema, model } = require('mongoose');

const InviteSchema = Schema({
  active: {
    type: Boolean,
    default: true,
  },
  inviteRecipients: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'InviteRecipient',
  },
  from: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
  },
  dateFrom: {
    type: Date,
    default: Date.now,
  },
  dateTo: {
    type: Date,
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