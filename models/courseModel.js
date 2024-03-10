import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
  
    coursename: {
      type: String,
      required: true,
    },
    maxAvaSeats: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    acceptedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    rejectedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    waitingStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructors",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);