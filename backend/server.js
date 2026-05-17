import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import extractRoute from "./routes/extract.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/extract", extractRoute);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log("✅ Server running on port ${PORT}");
});