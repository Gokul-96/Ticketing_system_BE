import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { sendOTP } from "../utils/sendMail.js";
import cryptoRandomString from "crypto-random-string";

// In-memory storage for temporary password reset tokens
const passwordResetTokens = {};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    forgot password & send otp
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
  
    try {
      // Dynamically import cryptoRandomString
      const { default: cryptoRandomString } = await import('crypto-random-string');
  
      // Generate a random OTP
      const otp = cryptoRandomString({ length: 6, type: "numeric" });
  
      // In-memory storage for temporary password reset tokens
      const passwordResetTokens = {};
  
      // Store the OTP in the in-memory storage
      passwordResetTokens[email] = otp;
  
      sendOTP(email, otp)
        .then(() => {
          res.json({ message: "OTP sent successfully." });
        })
        .catch((error) => {
          console.error("Error sending OTP:", error);
          res.status(500).json({ message: "Failed to send OTP." });
        });
    } catch (error) {
      console.error('Error importing cryptoRandomString:', error);
      res.status(500).json({ message: "Failed to generate OTP." });
    }
  });

// @desc    reset password & validate otp
// @route   POST /api/users/resetpassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
  
    // Check if the OTP matches the one stored in the in-memory storage
    if (passwordResetTokens[email] === otp) {
      const user = await User.findOne({ email });
  
      if (user) {
        if (newPassword) {
          user.password = newPassword;
        }
        const result = await user.save();
        if (result) {
          // Clear the OTP from the in-memory storage
          delete passwordResetTokens[email];
  
          res.json({ message: "Password reset successful." });
        } else {
          res.status(500).json({ message: "Failed to reset password." });
        }
      } else {
        res.status(404);
        throw new Error("User not found");
      }
    } else {
      res.status(401).json({ message: "Invalid OTP." });
    }
  });
  
  export { authUser, registerUser, forgotPassword, resetPassword };