import instructorModel from "../models/instructorModel.js";
import { hashPassword ,comparePassword} from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import studentModel from "../models/studentModel.js";

export const registerController = async (req, res) => {
  try {
    // destructuring the values coming from the model
    const { name, email, password, phone, role } = req.body;

    //checking the require values which were destructured
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if(!role) {
      return res.send({ message: "role is Required"});
    }

    // checking if the role is student or instructor
    let Model;
    if (role == "student") {
      Model = studentModel;
    } else if(role =="instructor"){
      Model = instructorModel;
    }
    else{
      return res.send({message: "provide valid role"})
    }
    //check user
    const exisitingUser = await Model.findOne({ email });

    //checking if user exists already
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    //saving hashpassword from helper
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new Model({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errror in Registeration",
      error,
    });
  }
};



// POST LOGIN API

export const loginController = async (req, res) => {
  try {
    const { email, password,role } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    let Model;
    if (role == "student") {
      Model = studentModel;
    } else if(role =="instructor"){
      Model = instructorModel;
    }
    else{
      return res.send({message: "provide valid role"})
    }
    //check user
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token assign
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });
    console.log(JWT.decode(token))
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
