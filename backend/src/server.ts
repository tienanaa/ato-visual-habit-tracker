import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habit.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Gắn Routes
app.use("/api/habits", habitRoutes);

app.listen(PORT, () => {
  console.log(`Backend đang chạy http://localhost:${PORT}`);
});
