// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
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

    phone: String,
    avatar: String,

    // location: {
    //   city: String,
    //   postalCode: String,
    //   address: String,
    //   coordinates: {
    //     type: {
    //       type: String,
    //       enum: ["Point"],
    //       default: "Point",
    //     },
    //     coordinates: {
    //       type: [Number],
    //     },
    //   },
    // },

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

userSchema.statics.hashPassword = async (pswd) => {
  try {
    const salt = await bcrypt.genSalt(8);
    return bcrypt.hash(pswd, salt);
  } catch (error) {
    console.log("Error hashing password:", error);
    throw error;
  }
};
userSchema.methods.comparePassword = function (pswd) {
  return bcrypt.compare(pswd, this.password);
};

module.exports = mongoose.model("User", userSchema);
