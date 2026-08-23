import { Router } from "express";
import { query } from "../config/db";

const router = Router();

/**
 * Tính toán chuỗi ngày liên tiếp thực tế dựa trên bảng habit_logs
 */
async function calculateUserStreak(userId: string): Promise<number> {
  const logsResult = await query(
    `SELECT DISTINCT log_date::text as log_date 
     FROM habit_logs 
     WHERE user_id = $1 
     ORDER BY log_date DESC`,
    [userId]
  );

  if (logsResult.rows.length === 0) return 0;

  const dates: string[] = logsResult.rows.map((r: any) => r.log_date);

  // Lấy ngày hôm nay và hôm qua theo định dạng YYYY-MM-DD
  const now = new Date();
  const formatYMD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatYMD(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatYMD(yesterday);

  const latestLog = dates[0];
  // Nếu ngày gần nhất không phải hôm nay và cũng không phải hôm qua -> chuỗi bị đứt (streak = 0)
  if (latestLog !== todayStr && latestLog !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(latestLog);

  for (const dateStr of dates) {
    const currentDate = new Date(dateStr);
    const diffTime = Math.abs(expectedDate.getTime() - currentDate.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// GET /:id — Lấy thông tin user (bao gồm current_streak tính thực tế)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    let result = await query(
      `SELECT id, email, full_name, custom_reminder, current_streak, created_at 
       FROM users 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      // Tự động khởi tạo demo user nếu đang truy vấn bằng demo UUID mà DB chưa có
      if (id === "00000000-0000-0000-0000-000000000001") {
        try {
          const demoUser = await query(
            `INSERT INTO users (id, email, hashed_password, full_name, current_streak)
             VALUES ('00000000-0000-0000-0000-000000000001', 'demo@ato.local', 'demohash', 'Demo User', 0)
             ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name
             RETURNING id, email, full_name, custom_reminder, current_streak, created_at`
          );
          if (demoUser.rows.length > 0) {
            result = demoUser;
          }
        } catch (insertErr) {
          console.error("Lỗi khi tự động khởi tạo demo user:", insertErr);
        }
      }

      if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    }

    // Tính toán streak thực tế từ lịch sử habit_logs
    const realStreak = await calculateUserStreak(id);

    // Cập nhật lại streak chính xác vào bảng users nếu có sự khác biệt
    if (result.rows[0].current_streak !== realStreak) {
      await query("UPDATE users SET current_streak = $1 WHERE id = $2", [realStreak, id]);
    }

    const userData = {
      ...result.rows[0],
      current_streak: realStreak,
    };

    res.json(userData);
  } catch (err) {
    console.error("Lỗi server khi lấy thông tin user:", err);
    res.status(500).json({ error: "Lỗi server khi lấy thông tin user" });
  }
});

export default router;
