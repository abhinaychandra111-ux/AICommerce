const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


/* =========================================================
   GENERATE JWT
   ========================================================= */

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


/* =========================================================
   REGISTER
   ========================================================= */

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};


/* =========================================================
   LOGIN
   ========================================================= */

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};


/* =========================================================
   GET CURRENT USER
   ========================================================= */

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to get current user",
      error: error.message,
    });
  }
};


/* =========================================================
   UPDATE PROFILE
   PUT /api/auth/profile
   ========================================================= */

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    /* ================================================
       NAME VALIDATION
       ================================================ */

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (trimmedName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Name must contain at least 2 characters",
        });
      }

      if (trimmedName.length > 50) {
        return res.status(400).json({
          success: false,
          message:
            "Name cannot exceed 50 characters",
        });
      }

      user.name = trimmedName;
    }


    /* ================================================
       EMAIL VALIDATION
       ================================================ */

    if (email !== undefined) {
      const normalizedEmail =
        email.trim().toLowerCase();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid email address",
        });
      }


      /* Check whether another user already
         has this email */

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: user._id,
          },
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "This email is already being used by another account",
        });
      }

      user.email = normalizedEmail;
    }


    /* ================================================
       PHONE VALIDATION
       ================================================ */

    if (phone !== undefined) {
      const normalizedPhone =
        phone.trim();

      if (
        normalizedPhone !== "" &&
        !/^[6-9]\d{9}$/.test(
          normalizedPhone
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid 10-digit mobile number",
        });
      }

      user.phone = normalizedPhone;
    }


    await user.save();


    /* ================================================
       RESPONSE
       ================================================ */

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    });

  } catch (error) {

    /* Handle MongoDB duplicate email */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already being used",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update profile",
      error: error.message,
    });
  }
};


/* =========================================================
   GET ALL ADDRESSES
   GET /api/auth/addresses
   ========================================================= */

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};


/* =========================================================
   ADD ADDRESS
   POST /api/auth/addresses
   ========================================================= */

const addAddress = async (req, res) => {
  try {
    const {
      label,
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone, address, city, state and pincode are required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 10-digit mobile number",
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 6-digit pincode",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const shouldBeDefault =
      user.addresses.length === 0;

    if (req.body.isDefault === true) {
      user.addresses.forEach(
        (savedAddress) => {
          savedAddress.isDefault = false;
        }
      );
    }

    const newAddress = {
      label: label || "Home",
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault:
        shouldBeDefault ||
        req.body.isDefault === true,
    };

    user.addresses.push(newAddress);

    await user.save();

    const savedAddress =
      user.addresses[
        user.addresses.length - 1
      ];

    res.status(201).json({
      success: true,
      message:
        "Address added successfully",
      address: savedAddress,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message,
    });
  }
};


/* =========================================================
   UPDATE ADDRESS
   PUT /api/auth/addresses/:addressId
   ========================================================= */

const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const {
      label,
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const savedAddress =
      user.addresses.id(addressId);

    if (!savedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (
      phone &&
      !/^[6-9]\d{9}$/.test(phone)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 10-digit mobile number",
      });
    }

    if (
      pincode &&
      !/^\d{6}$/.test(pincode)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 6-digit pincode",
      });
    }

    if (label !== undefined)
      savedAddress.label = label;

    if (name !== undefined)
      savedAddress.name = name;

    if (phone !== undefined)
      savedAddress.phone = phone;

    if (address !== undefined)
      savedAddress.address = address;

    if (city !== undefined)
      savedAddress.city = city;

    if (state !== undefined)
      savedAddress.state = state;

    if (pincode !== undefined)
      savedAddress.pincode = pincode;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Address updated successfully",
      address: savedAddress,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to update address",
      error: error.message,
    });
  }
};


/* =========================================================
   DELETE ADDRESS
   DELETE /api/auth/addresses/:addressId
   ========================================================= */

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const savedAddress =
      user.addresses.id(addressId);

    if (!savedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault =
      savedAddress.isDefault;

    savedAddress.deleteOne();

    if (
      wasDefault &&
      user.addresses.length > 0
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete address",
      error: error.message,
    });
  }
};


/* =========================================================
   SET DEFAULT ADDRESS
   PUT /api/auth/addresses/:addressId/default
   ========================================================= */

const setDefaultAddress = async (
  req,
  res
) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const selectedAddress =
      user.addresses.id(addressId);

    if (!selectedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses.forEach(
      (savedAddress) => {
        savedAddress.isDefault = false;
      }
    );

    selectedAddress.isDefault = true;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Default address updated successfully",
      address: selectedAddress,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to set default address",
      error: error.message,
    });
  }
};


/* =========================================================
   EXPORTS
   ========================================================= */

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,

  updateProfile,

  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};