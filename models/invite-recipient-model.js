const { Schema, model } = require('mongoose');

const InviteRecipientSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
  },
  status: {
    type: String,
    default: 'PENDING',
    enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
  },
}, {
  timestamps: true,
});

InviteRecipientSchema.methods.toJSON = function () {
  const { __v, ...inviteRecipient } = this.toObject();
  return inviteRecipient;
}

module.exports = model('InviteRecipient', InviteRecipientSchema);