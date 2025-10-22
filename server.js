import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stringRoutes from "./routes/stringRoutes.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res
    .status(200)
    .json({
      message:
        "Welcome to Bilaal's string analyzer, visit https://github.com/bilaalk079/bilaal-hng-stage-1 to view the README / Docs",
    });
});
app.use("/strings", stringRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
