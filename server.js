import  express  from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoute.js"
dotenv.config();

//configure env
dotenv.config();

//databse config
connectDB();

// initiating express
const app = express();


app.use(express.json())
app.use("/api/v1/auth", authRoutes);




const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server Running onmode on port ${PORT}`.bgGreen.white);
  });