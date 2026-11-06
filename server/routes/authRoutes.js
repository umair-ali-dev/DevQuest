import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/authValidator.js";

import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many profile update attempts. Please try again later.",
  },
});

// REGISTER
router.post(
  "/register",
  authLimiter,
  validateRequest(registerSchema),
  register
);

// LOGIN
router.post(
  "/login",
  authLimiter,
  validateRequest(loginSchema),
  login
);

// LOGOUT
router.post("/logout", logout);

// CURRENT USER
router.get("/me", optionalAuth, getMe);

// UPDATE PROFILE
router.patch(
  "/profile",
  protect,
  profileUpdateLimiter,
  validateRequest(updateProfileSchema),
  updateProfile
);

// CHANGE PASSWORD
router.patch(
  "/change-password",
  protect,
  profileUpdateLimiter,
  validateRequest(changePasswordSchema),
  changePassword
);

export default router;
