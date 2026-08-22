import { Router } from "express";
import { query } from "../config/db";

const router = Router();

// GET /:userId — Lấy danh sách habit của user kèm trạng thái hoàn thành hôm nay
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await query(
      `SELECT h.*, 
              EXISTS (
                SELECT 1 FROM habit_logs hl 
                WHERE hl.habit_id = h.id 
                  AND hl.user_id = h.user_id 
                  AND hl.log_date = CURRENT_DATE
              ) AS is_completed_today
       FROM habits h 
       WHERE h.user_id = $1 
       ORDER BY h.created_at ASC`,
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
    const { user_id, title, color_code, description, reminder_time } = req.body;

    if (!user_id || !title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "user_id và title là bắt buộc" });
      return;
    }

    const safeColor = color_code && typeof color_code === "string" ? color_code : "purple";
    const safeDesc = description && typeof description === "string" && description.trim() !== "" ? description.trim() : null;
    const safeReminder = reminder_time && typeof reminder_time === "string" && reminder_time.trim() !== "" ? reminder_time.trim() : null;

    const result = await query(
      "INSERT INTO habits (user_id, title, color_code, description, reminder_time) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, title.trim(), safeColor, safeDesc, safeReminder],
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

// DELETE /log — Bỏ tích hoàn thành thói quen
router.delete("/log", async (req, res) => {
  try {
    const { habit_id, user_id, log_date } = req.body;

    if (!habit_id || !user_id || !log_date) {
      res.status(400).json({ error: "habit_id, user_id và log_date là bắt buộc" });
      return;
    }

    const result = await query(
      "DELETE FROM habit_logs WHERE habit_id = $1 AND user_id = $2 AND log_date = $3 RETURNING *",
      [habit_id, user_id, log_date],
    );

    res.json({
      message: "Đã hủy đánh dấu hoàn thành!",
      deletedCount: result.rowCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi xóa log hoàn thành" });
  }
});

// PUT /:id — Cập nhật habit
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, color_code, description, reminder_time } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "title là bắt buộc" });
      return;
    }

    const safeColor = color_code && typeof color_code === "string" ? color_code : "purple";
    const safeDesc = description && typeof description === "string" && description.trim() !== "" ? description.trim() : null;
    const safeReminder = reminder_time && typeof reminder_time === "string" && reminder_time.trim() !== "" ? reminder_time.trim() : null;

    const result = await query(
      "UPDATE habits SET title = $1, color_code = $2, description = $3, reminder_time = $4 WHERE id = $5 RETURNING *",
      [title.trim(), safeColor, safeDesc, safeReminder, id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi cập nhật thói quen" });
  }
});

// DELETE /:id — Xóa habit
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "DELETE FROM habits WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }
    res.json({ deleted: true, id: Number(id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi xóa thói quen" });
  }
});

export default router;

