//starting express
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import appointmentRoutes from "./routes/appointment.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import imageRoutes from "./routes/image.route.js";
import userRoutes from "./routes/user.route.js";
import reviewRoutes from "./routes/review.route.js";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); //allows us to accept JSON data in the req.body

app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api", imageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`server started at http://localhost:${PORT}`);
});
