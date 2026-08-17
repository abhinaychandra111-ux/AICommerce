const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// =========================================================
// CREATE ORDER
// POST /api/orders
// =========================================================
const createOrder = async (req, res) => {
  try {
    console.log("\n========== CREATE ORDER ==========");

    const {
      items,
      address,
      paymentMethod,
      coupon,
      couponDiscount = 0,
      deliveryFee = 0,
      platformFee = 0,
      handlingFee = 0,
    } = req.body;

    // -----------------------------------------------------
    // 1. CHECK USER
    // -----------------------------------------------------
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // -----------------------------------------------------
    // 2. CHECK ITEMS
    // -----------------------------------------------------
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }

    // -----------------------------------------------------
    // 3. CHECK ADDRESS
    // -----------------------------------------------------
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // -----------------------------------------------------
    // 4. NORMALIZE ADDRESS
    // Supports both name and fullName
    // -----------------------------------------------------
    const deliveryAddress = {
      name: String(
        address.name || address.fullName || ""
      ).trim(),

      phone: String(
        address.phone || ""
      ).trim(),

      address: String(
        address.address || ""
      ).trim(),

      city: String(
        address.city || ""
      ).trim(),

      state: String(
        address.state || ""
      ).trim(),

      pincode: String(
        address.pincode || address.pinCode || ""
      ).trim(),

      label: String(
        address.label || "Home"
      ).trim(),
    };

    console.log(
      "DELIVERY ADDRESS:",
      deliveryAddress
    );

    // -----------------------------------------------------
    // 5. VALIDATE ADDRESS
    // -----------------------------------------------------
    const requiredFields = [
      "name",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!deliveryAddress[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required in delivery address`,
        });
      }
    }

    // -----------------------------------------------------
    // 6. NORMALIZE PAYMENT METHOD
    // -----------------------------------------------------
    const normalizedPaymentMethod =
      String(paymentMethod || "cod").toLowerCase();

    const allowedPaymentMethods = [
      "cod",
      "upi",
      "card",
      "netbanking",
    ];

    if (
      !allowedPaymentMethods.includes(
        normalizedPaymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // -----------------------------------------------------
    // 7. NORMALIZE PRODUCT IDS
    // -----------------------------------------------------
    const normalizedItems = [];

    for (const item of items) {
      const productId =
        item.product ||
        item.productId ||
        item._id ||
        item.id;

      const quantity = Number(item.quantity);

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${productId}`,
        });
      }

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product quantity",
        });
      }

      normalizedItems.push({
        product: productId,
        quantity,
      });
    }

    console.log(
      "NORMALIZED ITEMS:",
      normalizedItems
    );

    // -----------------------------------------------------
    // 8. GET PRODUCTS FROM MONGODB
    // -----------------------------------------------------
    const productIds = normalizedItems.map(
      (item) => item.product
    );

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    });

    console.log(
      "PRODUCTS FOUND:",
      products.length
    );

    // -----------------------------------------------------
    // 9. MAKE SURE ALL PRODUCTS EXIST
    // -----------------------------------------------------
    if (
      products.length !==
      new Set(productIds.map(String)).size
    ) {
      for (const item of normalizedItems) {
        const exists = products.some(
          (product) =>
            product._id.toString() ===
            String(item.product)
        );

        if (!exists) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.product}`,
          });
        }
      }
    }

    // -----------------------------------------------------
    // 10. CREATE ORDER ITEMS
    // -----------------------------------------------------
    const orderItems = [];
    let subtotal = 0;

    for (const item of normalizedItems) {
      const product = products.find(
        (p) =>
          p._id.toString() ===
          String(item.product)
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock`,
        });
      }

      const itemTotal =
        Number(product.price) *
        item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // -----------------------------------------------------
    // 11. CALCULATE TOTAL
    // -----------------------------------------------------

    // Use frontend delivery fee if supplied.
    // Otherwise:
    // subtotal >= 5000 -> free
    // subtotal < 5000 -> 100
    let finalDeliveryFee =
      Number(deliveryFee);

    if (
      !Number.isFinite(finalDeliveryFee) ||
      finalDeliveryFee < 0
    ) {
      finalDeliveryFee =
        subtotal >= 5000 ? 0 : 100;
    }

    const finalCouponDiscount =
      Number(couponDiscount) || 0;

    const finalPlatformFee =
      Number(platformFee) || 0;

    const finalHandlingFee =
      Number(handlingFee) || 0;

    const total =
      subtotal -
      finalCouponDiscount +
      finalDeliveryFee +
      finalPlatformFee +
      finalHandlingFee;

    // -----------------------------------------------------
    // 12. PREVENT NEGATIVE TOTAL
    // -----------------------------------------------------
    if (total < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order total",
      });
    }

    console.log("SUBTOTAL:", subtotal);
    console.log(
      "DELIVERY FEE:",
      finalDeliveryFee
    );
    console.log(
      "COUPON DISCOUNT:",
      finalCouponDiscount
    );
    console.log(
      "PLATFORM FEE:",
      finalPlatformFee
    );
    console.log(
      "HANDLING FEE:",
      finalHandlingFee
    );
    console.log("TOTAL:", total);

    // -----------------------------------------------------
    // 13. CREATE ORDER
    // -----------------------------------------------------
    // Generate a unique order ID
const orderId =
  "ORD-" +
  Date.now() +
  "-" +
  Math.floor(1000 + Math.random() * 9000);

// Create order
const order = await Order.create({
  orderId,

  user: req.user._id,

  items: orderItems,

  address: deliveryAddress,

  paymentMethod: normalizedPaymentMethod,

  coupon: coupon || null,

  couponDiscount: finalCouponDiscount,

  deliveryFee: finalDeliveryFee,

  platformFee: finalPlatformFee,

  handlingFee: finalHandlingFee,

  subtotal,

  total,
});

    // -----------------------------------------------------
    // 14. REDUCE PRODUCT STOCK
    // -----------------------------------------------------
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    console.log(
      "ORDER CREATED:",
      order._id
    );

    console.log(
      "================================\n"
    );

    // -----------------------------------------------------
    // 15. SUCCESS RESPONSE
    // -----------------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// =========================================================
// GET CURRENT USER ORDERS
// GET /api/orders/my-orders
// =========================================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get My Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// =========================================================
// GET SINGLE ORDER
// GET /api/orders/:id
// =========================================================
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// =========================================================
// EXPORT
// =========================================================
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};