import { Router } from "express";
import { query } from "../config/db";

const router = Router();

// Phase 5.1 — GET /:userId/summary
router.get("/:userId/summary", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(
      `SELECT
        (SELECT COUNT(*)::int FROM habits WHERE user_id = $1) AS total_habits,
        (SELECT current_streak FROM users WHERE id = $1) AS current_streak,
        (SELECT COUNT(DISTINCT habit_id)::int
         FROM habit_logs
         WHERE user_id = $1 AND log_date = CURRENT_DATE) AS completed_today`,
      [userId],
    );

    const row = result.rows[0];
    const totalHabits: number = row.total_habits ?? 0;
    const completedToday: number = row.completed_today ?? 0;
    const completionRateToday =
      totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    res.json({
      totalHabits,
      currentStreak: row.current_streak ?? 0,
      completedToday,
      completionRateToday,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats summary" });
  }
});

// Phase 5.2 — GET /:userId/daily-completion
// Phase 5.3 — GET /:userId/habit-distribution
// Phase 5.4 — GET /:userId/mood-trend
// Phase 5.6 — GET /:userId/insights
// Phase 5.7 — GET /:userId/habit-streaks

export default router;

