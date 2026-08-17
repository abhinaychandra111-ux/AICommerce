const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,

  updateProfile,

  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


/* =========================================================
   AUTHENTICATION
   ========================================================= */

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/me",
  protect,
  getCurrentUser
);


/* =========================================================
   PROFILE
   ========================================================= */

router.put(
  "/profile",
  protect,
  updateProfile
);


/* =========================================================
   ADDRESSES
   ========================================================= */

router.get(
  "/addresses",
  protect,
  getAddresses
);

router.post(
  "/addresses",
  protect,
  addAddress
);

router.put(
  "/addresses/:addressId",
  protect,
  updateAddress
);

router.delete(
  "/addresses/:addressId",
  protect,
  deleteAddress
);

router.put(
  "/addresses/:addressId/default",
  protect,
  setDefaultAddress
);


module.exports = router;