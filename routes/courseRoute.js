import express from "express";
import { 
  addNewCourseController,
  updateCourseController,
  registerStudentForCourseController,
  studentUpdateStatusController,
  searchStudentController
} from "../controllers/courseController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

// Create a router object
const router = express.Router();

// Define routes

// Endpoint for adding a new course (POST)
router.post("/addnewcourse", requireSignIn, addNewCourseController);

// Endpoint for updating a course (PUT)
router.put("/updatecourse/:id", requireSignIn, updateCourseController);

// Endpoint for registering a student for a course (POST)
router.post("/studentregistercourse/:id", requireSignIn, registerStudentForCourseController);

// Endpoint for updating student status (POST)
router.post("/updatestudentstatus/:courseId/:studentId", requireSignIn, studentUpdateStatusController);

// Endpoint for searching students (GET)
router.get("/searchstudent", requireSignIn, searchStudentController);

// Export the router object
export default router;
