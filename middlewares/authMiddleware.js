import JWT from "jsonwebtoken";
import userModel from "../models/studentModel.js";

/**
 * Middleware to protect routes by verifying JWT token.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const requireSignIn = async (req, res, next) => {
  try {
    // Verify JWT token
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRETKEY
    );
    
    // Set decoded user information to request object
    req.user = decode;
    
    // Move to the next middleware
    next();
  } catch (error) {
    console.error(error);
  }
};
