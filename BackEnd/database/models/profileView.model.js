const mongoose = require("mongoose");

const profileViewSchema = new mongoose.Schema(
  {
    pro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true },
);

profileViewSchema.index(
  { pro: 1, viewer: 1 },
  { unique: true, partialFilterExpression: { viewer: { $type: "objectId" } } },
);
profileViewSchema.index(
  { pro: 1, guestId: 1 },
  {
    unique: true,
    partialFilterExpression: { guestId: { $type: "string" } },
  },
);

module.exports = mongoose.model("ProfileView", profileViewSchema);
