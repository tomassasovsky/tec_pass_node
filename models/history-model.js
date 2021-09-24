const { Schema, model } = require("mongoose");

const HistorySchema = Schema({
  action: {
    type: String,
    required: true,
    enum: ["OPEN", "CLOSE"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  door: {
    type: Schema.Types.ObjectId,
    ref: "Door",
    required: true,
  },
}, {
  timestamps: true,
});

HistorySchema.methods.toJSON = function () {
  const { __v, ...history } = this.toObject();
  return history;
}

module.exports = model('History', HistorySchema);