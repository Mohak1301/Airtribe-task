import express from "express";
import { addCommentController } from "../controllers/commentController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

// Create a router object
const router = express.Router();

// Define routes

// Endpoint for adding a new comment (POST)
router.post("/new-comment/:id", requireSignIn, addCommentController);

// Export the router object
export default router;
