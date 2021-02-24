const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slackSchema = new Schema({
  channelName: {
    type: String
  },
  conversation: [
    {
      type: String,
      message: String,
      timestamp: String,
      user: String,
      userImage: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Slack = mongoose.model("conversations", slackSchema);