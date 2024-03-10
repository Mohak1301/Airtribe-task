import express from "express";
import { registerController, loginController } from "../controllers/authController.js";

// Create a router object
const router = express.Router();

// Define routes

// Endpoint for user registration (POST)
router.post("/register", registerController);

// Endpoint for user login (POST)
router.post("/login", loginController);


// Export the router object
export default router;
