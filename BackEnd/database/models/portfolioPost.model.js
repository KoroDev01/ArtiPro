const mongoose = require("mongoose");

const portfolioPostSchema = new mongoose.Schema(
  {
    pro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    photos: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("PortfolioPost", portfolioPostSchema);
