const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    budget: {
      type: Number,
    },

    location: {
      city: String,
      address: String,
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },

    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    photos: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
