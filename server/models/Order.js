const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);


const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      default: "Home",
    },
  },
  {
    _id: false,
  }
);


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) =>
          items.length > 0,
        message:
          "Order must contain at least one item",
      },
    },

    address: {
      type: addressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "upi",
        "card",
        "netbanking",
        "cod",
      ],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "cod",
      ],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "confirmed",
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    platformFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    handlingFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    coupon: {
      type: String,
      default: null,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model(
  "Order",
  orderSchema
);


module.exports = Order;