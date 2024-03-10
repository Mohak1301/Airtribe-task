import instructorModel from "../models/instructorModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import studentModel from "../models/studentModel.js";

// Controller for user registration
export const registerController = async (req, res) => {
  try {
    // Destructuring the values coming from the request body
    const { name, email, password, phone, role, linkedin } = req.body;

    // Checking the required values
    if (!name) {
      return res.status(400).send({ error: "Name is required." });
    }
    if (!email) {
      return res.status(400).send({ error: "Email is required." });
    }
    if (!password) {
      return res.status(400).send({ error: "Password is required." });
    }
    if (!phone) {
      return res.status(400).send({ error: "Phone number is required." });
    }
    if (!role) {
      return res.status(400).send({ error: "Role is required." });
    }
    if (!linkedin) {
      return res.status(400).send({ error: "Linkedin ID is required." });
    }

    // Checking if the role is student or instructor
    let Model;
    if (role === "student") {
      Model = studentModel;
    } else if (role === "instructor") {
      Model = instructorModel;
    } else {
      return res.status(400).send({ error: "Invalid role provided." });
    }

    // Checking if the user already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ error: "User already registered. Please login." });
    }

    // Saving hashed password
    const hashedPassword = await hashPassword(password);

    // Saving the user
    const user = await new Model({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      linkedin,
    }).save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error occurred during registration.",
      error,
    });
  }
};

// Controller for user login
export const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password provided.",
      });
    }

    // Checking if the role is student or instructor
    let Model;
    if (role === "student") {
      Model = studentModel;
    } else if (role === "instructor") {
      Model = instructorModel;
    } else {
      return res.status(400).send({ error: "Invalid role provided." });
    }

    // Check if user exists
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered.",
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password.",
      });
    }

    // Assign token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred during login.",
      error,
    });
  }
};
