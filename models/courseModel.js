import mongoose from "mongoose";

// Define the schema for the Course model
const courseSchema = new mongoose.Schema(
  {
    // The name of the course
    coursename: {
      type: String,
      required: true,
    },
    // The maximum available seats for the course
    maxAvaSeats: {
      type: Number,
      required: true,
    },
    // The start date of the course
    startDate: {
      type: Date,
      required: true,
    },
    // Array of students who have been accepted into the course
    acceptedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Reference to the Student model
      },
    ],
    // Array of students who have been rejected from the course
    rejectedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Reference to the Student model
      },
    ],
    // Array of students who are on the waiting list for the course
    waitingStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Reference to the Student model
      },
    ],
    // The ID of the instructor who created the course
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructors", // Reference to the Instructors model
      required: true,
    },
    // Description of the course
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Course model based on the defined schema
export default mongoose.model("Course", courseSchema);
