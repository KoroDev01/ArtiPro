const mongoose = require("mongoose");
const { Schema } = mongoose;

const offerSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    pro: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Offer", offerSchema);
