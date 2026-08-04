import { Router } from "express";
import { query } from "../config/db";

const router = Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Dùng hàm query đã export
    const result = await query(
      "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at ASC",
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu thói quen" });
  }
});

// API 2: Tích hoàn thành thói quen
router.post("/log", async (req, res) => {
  try {
    const { habit_id, user_id, log_date } = req.body;

    const newLog = await query(
      "INSERT INTO habit_logs (habit_id, user_id, log_date) VALUES ($1, $2, $3) RETURNING *",
      [habit_id, user_id, log_date],
    );

    res.status(201).json({
      message: "Đã lưu thành công và cập nhật chuỗi tự động!",
      data: newLog.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi lưu log" });
  }
});

export default router;
