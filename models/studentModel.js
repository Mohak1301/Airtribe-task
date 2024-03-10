import mongoose from "mongoose";

// Define the schema for the Student model
const studentSchema = new mongoose.Schema(
  {
    // The name of the student
    name: {
      type: String,
      required: true,
    },
    // The email of the student
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // The password of the student
    password: {
      type: String,
      required: true,
    },
    // The phone number of the student
    phone: {
      type: String,
      required: true,
    },
    // The role of the student (e.g., "student", "admin")
    role: {
      type: String,
      required: true,
    },
    // The LinkedIn ID of the student
    linkedin: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Student model based on the defined schema
export default mongoose.model("Student", studentSchema);
