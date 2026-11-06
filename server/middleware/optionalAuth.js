import jwt from "jsonwebtoken";
import User from "../models/User.js";

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // No token means the visitor is simply logged out.
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Invalid or expired token:
    // Treat the visitor as unauthenticated.
    req.user = null;
  }

  next();
};

export default optionalAuth;