const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: false,
    maxlength: 3000,
  },
  user_id: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Community", CommunitySchema);
