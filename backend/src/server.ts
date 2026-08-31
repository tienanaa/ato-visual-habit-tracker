import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import habitRoutes from "./routes/habit.routes";
import userRoutes from "./routes/user.routes";
import statsRoutes from "./routes/stats.routes";
import { query } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check API
app.get("/api/health", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json({
      status: "ok",
      database: "connected",
      timestamp: result.rows[0].now,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: err.message,
    });
  }
});

// Gắn Routes
app.use("/api/habits", habitRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);

app.listen(PORT, () => {
  console.log(`Backend đang chạy http://localhost:${PORT}`);
});
