// Import necessary modules and dependencies
import commentModel from "../models/commentModel.js";
import { decode } from "jsonwebtoken";


export const addCommentController = async (req, res) => {
  try {
    // Parse request body to extract course ID and comment text
    const courseId = req.params.id;
    const { text } = req.body;

    // Validate input data: course ID and comment text are required
    if (!courseId || !text) {
      return res.status(400).send({ message: "Please provide both course ID and comment text." });
    }

    // Decode JWT token to get user ID
    const token = req.headers.authorization;
    const userId = await decode(token)._id;

    // Create comment in the database
    const comment = await commentModel.create({
      courseId,
      userId,
      text,
    });

    // Return success message along with the added comment
    return res.status(201).send({ success: true, message: "Comment added successfully.", comment });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).send({ success: false, message: "Error occurred while adding comment.", error });
  }
};
