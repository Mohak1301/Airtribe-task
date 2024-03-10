import  express  from "express";
import { addNewCourseController,updateCourseController } from "../controllers/courseController.js";
//router object
const router = express.Router();

//routing



//NEWCOURSE || POST
router.post("/addnewcourse",addNewCourseController);

router.put("/updatecourse/:id",updateCourseController)

export default router;