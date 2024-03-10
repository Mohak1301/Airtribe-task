import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoute.js";
import courseRoutes from "./routes/courseRoute.js";
import commentRoutes from "./routes/commentRoute.js";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes); // Authentication routes
app.use("/api/v1/course", courseRoutes); // Course-related routes
app.use("/api/v1/comment", commentRoutes); // Comment-related routes

app.use("/",(req,res)=>{
    res.send("<h1>Airtribe Project</h1>")
})

// Define the port
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
