import { Router } from "express";
import { query } from "../config/db";

const router = Router();

// GET /:userId — Lấy danh sách habit của user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
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

// POST / — Tạo habit mới
router.post("/", async (req, res) => {
  try {
    const { user_id, title, color_code } = req.body;

    if (!user_id || !title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "user_id và title là bắt buộc" });
      return;
    }

    const safeColor = color_code && typeof color_code === "string" ? color_code : "purple";

    const result = await query(
      "INSERT INTO habits (user_id, title, color_code) VALUES ($1, $2, $3) RETURNING *",
      [user_id, title.trim(), safeColor],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi tạo thói quen" });
  }
});

// POST /log — Tích hoàn thành thói quen
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

