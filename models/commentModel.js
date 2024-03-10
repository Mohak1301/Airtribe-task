import mongoose from "mongoose";

// Define the schema for the Comment model
const commentSchema = new mongoose.Schema({
  // Reference to the user who created the comment (student or instructor)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student" || "instructor", // Reference to either student or instructor model
    required: true,
  },
  // Reference to the course the comment is related to
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Reference to the Course model
    required: true,
  },
  // The text content of the comment
  text: {
    type: String,
    required: true,
  },
  // The timestamp of when the comment was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model based on the defined schema
export default mongoose.model("Comment", commentSchema);
