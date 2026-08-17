const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    badge: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;