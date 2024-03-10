import  express  from "express";
import { registerController,loginController } from "../controllers/authController.js";
//router object
const router = express.Router();

//routing

//REGISTER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//NEWCOURSE || POST
router.post

export default router;