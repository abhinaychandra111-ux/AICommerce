const mongoose = require("mongoose");


/* =========================================================
   ADDRESS SCHEMA
   ========================================================= */

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^[6-9]\d{9}$/,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{6}$/,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


/* =========================================================
   USER SCHEMA
   ========================================================= */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    /* Primary profile mobile number */
    phone: {
      type: String,
      trim: true,
      default: "",
      match: /^$|^[6-9]\d{9}$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    addresses: {
      type: [addressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;