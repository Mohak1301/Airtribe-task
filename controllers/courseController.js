// Import necessary modules and dependencies
import courseModel from "../models/courseModel.js";
import studentModel from "../models/studentModel.js";
import { decode } from "jsonwebtoken";

/**
 * Controller function to add a new course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response object containing success status, message, and new course details.
 */
export const addNewCourseController = async (req, res) => {
  try {
    // Check if user is authenticated and has the necessary permissions (role: instructor)
    if (req.body.role !== "instructor") {
      return res.status(403).send({
        message: "Access denied. Only instructors can add a course.",
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
        message: "Course name, max available seats, start date, and creator ID are required.",
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

    // Return success message along with new course details
    return res.status(200).send({
      success: true,
      message: "New course created successfully.",
      newCourse,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error encountered while creating new course.",
      error,
    });
  }
};

/**
 * Controller function to update course details.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response object containing success status, message, and updated course details.
 */
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
        message: "Access denied. You are not authorized to update this course.",
      });
    }

    // Update course details in database
    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, updateData, { new: true });

    // Return success message along with updated course details
    return res.status(200).send({
      success: true,
      message: "Course details updated successfully.",
      course: updatedCourse,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error encountered while updating course details.",
      error,
    });
  }
};

/**
 * Controller function to register a student for a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response object containing success status and message.
 */
export const registerStudentForCourseController = async (req, res) => {
  try {
    // Parse request body
    const courseId = req.params.id;
    const { name, email, phone, linkedin } = req.body;

    // Validate input data
    if (!name || !email || !phone || !linkedin) {
      return res.status(400).send({
        message: "Name, email, phone number, and LinkedIn id are required.",
      });
    }

    // Find the course by ID
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found." });
    }

    // Find the student by matching name, email, phone number, and LinkedIn profile
    const student = await studentModel.findOne({ name, email, phone, linkedin });

    // If student not found, return error
    if (!student) {
      return res.status(404).send({
        message: "Student not found. Please provide correct details or register as a student first.",
      });
    }

    // Add student ID to the waiting list of the course
    course.waitingStudents.push(student._id);
    await course.save();

    // Return success message
    return res.status(200).send({
      success: true,
      message: "Student registered for the course successfully.",
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error encountered while registering student for the course.",
      error,
    });
  }
};

/**
 * Controller function to update the status of a student enrolled in a course.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response object containing success status and message.
 */
export const studentUpdateStatusController = async (req, res) => {
  try {
    // Parse request parameters
    const { courseId, studentId } = req.params;
    const { status } = req.body;

    // Validate input data
    if (!status || !["accepted", "rejected", "waiting"].includes(status)) {
      return res.status(400).send({
        message: "Invalid status value. Status must be 'accepted', 'rejected', or 'waiting'.",
      });
    }

    // Find the course by ID
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found." });
    }

    // Decode JWT token to get creatorId
    const token = req.headers.authorization;
    const creatorId = await decode(token)._id;

    // Check if the user making the request is the creator of the course
    if (course.creatorId.toString() !== creatorId) {
      return res.status(403).send({ message: "You are not authorized to update this student." });
    }

    // Find the student by ID
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found." });
    }

    // Update the student's status
    student.status = status;

    // If status is updated to "accepted" or "rejected", move the student to the corresponding list of the course
    if (status === "accepted") {
      course.waitingStudents.pull(studentId);
      course.acceptedStudents.push(studentId);
    } else if (status === "rejected") {
      course.waitingStudents.pull(studentId);
      course.rejectedStudents.push(studentId);
    }

    await Promise.all([student.save(), course.save()]);

    // Return success message
    return res.status(200).send({ success: true, message: "Student status updated successfully." });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error encountered while updating student status.",
      error,
    });
  }
};

/**
 * Controller function to search for students by name or email.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Response object containing success status, message, and search results.
 */
export const searchStudentController = async (req, res) => {
  try {
    // Parse query parameters
    const { keyword } = req.body;

    // Validate input data
    if (!keyword) {
      return res.status(400).send({ message: "Keyword parameter is required for search." });
    }

    // Search for leads in the StudentModel by name or email
    const results = await studentModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } }, // Case-insensitive regex search for name
        { email: { $regex: keyword, $options: "i" } }, // Case-insensitive regex search for email
      ],
    });

    // Return search results
    return res.status(200).send({ success: true, results });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error encountered while searching for students.",
      error,
    });
  }
};
