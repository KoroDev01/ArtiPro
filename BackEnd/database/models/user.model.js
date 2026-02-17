// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["admin", "pro", "client"],
      required: true,
    },

    // Infos communes
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: String,
    avatar: String,

    location: {
      city: String,
      postalCode: String,
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], 
        },
      },
    },

    // PRO uniquement
    companyName: String,
    siret: String,
    description: String,
    experienceYears: Number,
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    availability: {
      type: Boolean,
      default: true,
    },

    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("User", userSchema);
