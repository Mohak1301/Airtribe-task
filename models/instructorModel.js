import mongoose from "mongoose";

// Define the schema for the Instructor model
const instructorSchema = new mongoose.Schema(
  {
    // The name of the instructor
    name: {
      type: String,
      required: true,
    },
    // The email of the instructor
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // The password of the instructor
    password: {
      type: String,
      required: true,
    },
    // The phone number of the instructor
    phone: {
      type: String,
      required: true,
    },
    // The role of the instructor (e.g., "admin", "instructor")
    role: {
      type: String,
      required: true,
    },
    // The LinkedIn ID of the instructor
    linkedin: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Instructor model based on the defined schema
export default mongoose.model("Instructors", instructorSchema);
