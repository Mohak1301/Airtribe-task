import courseModel from "../models/courseModel.js";
import { decode } from "jsonwebtoken";

// Controller to add a new course
export const addNewCourseController = async (req, res) => {
  try {
    // Check if user is authenticated and has the necessary permissions (role: instructor)
    if (req.body.role !== "instructor") {
      return res.status(403).send({
        message: "Only instructors can add a course",
      });
    }

    // Decode JWT token to get creatorId
    const token = req.headers.authorization;
    const creatorId = await decode(token)._id;

    // Parse request body
    const {
      coursename,
      maxAvaSeats,
      startDate,
      acceptedStudents,
      rejectedStudents,
      waitingStudents,
      description,
      
    } = req.body;

    // Validate input data
    if (!coursename || !maxAvaSeats || !startDate || !creatorId) {
      return res.status(400).send({
        message: "Name, maxSeats, startDate, and creatorId are required.",
      });
    }

    // Create new course in MongoDB
    const newCourse = await new courseModel({
      coursename,
      maxAvaSeats,
      startDate,
      acceptedStudents,
      rejectedStudents,
      waitingStudents,
      creatorId,
      description,
    }).save();

    return res.status(200).send({
      success: true,
      message: "New Course created successfully.",
      newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in creating new course.",
      error,
    });
  }
};

// Controller to update course details
export const updateCourseController = async (req, res) => {
  try {
    // Parse request parameters
    const courseId = req.params.id;
    const updateData = req.body;

    // Decode JWT token to get creatorId
    const token = req.headers.authorization;
    const creatorId = await decode(token)._id;

    // Finding course by ID from database
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({ success: false, message: "Course not found." });
    }

    // Checking if the logged-in user is the one who created the course
    if (course.creatorId != creatorId) {
      return res.status(403).send({
        success: false,
        message: "Not Authorized to update this course",
      });
    }

    // Update course details in database
    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, updateData, { new: true });

    return res.status(200).send({
      success: true,
      message: "Course details updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in updating course details",
      error,
    });
  }
};


