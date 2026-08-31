// Stats service — các hàm fetch được thêm dần qua Phase 5.1 → 5.7

import type {
  StatsSummary,
  DailyCompletion,
  HabitDistribution,
  MoodStat,
  StatsInsights,
  HabitStreak,
} from "../types/stats";

const BASE_URL = "http://localhost:5000/api/stats";

// Phase 5.1 — Summary Cards
export async function getStatsSummary(userId: string): Promise<StatsSummary> {
  const res = await fetch(`${BASE_URL}/${userId}/summary`);
  if (!res.ok) throw new Error("Failed to fetch stats summary");
  return res.json();
}

// Phase 5.2 — Activity Heatmap + Line Chart
export async function getDailyCompletion(
  userId: string,
  days: number = 30,
): Promise<DailyCompletion[]> {
  const res = await fetch(`${BASE_URL}/${userId}/daily-completion?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch daily completion");
  return res.json();
}

// Phase 5.3 — Donut Chart
export async function getHabitDistribution(
  userId: string,
  days: number = 30,
): Promise<HabitDistribution[]> {
  const res = await fetch(`${BASE_URL}/${userId}/habit-distribution?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch habit distribution");
  return res.json();
}

// Phase 5.4 — Mood Bar Chart
export async function getMoodTrend(
  userId: string,
  days: number = 30,
): Promise<MoodStat[]> {
  const res = await fetch(`${BASE_URL}/${userId}/mood-trend?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch mood trend");
  return res.json();
}

// Phase 5.6 — Insight Cards
export async function getInsights(
  userId: string,
  days: number = 30,
): Promise<StatsInsights> {
  const res = await fetch(`${BASE_URL}/${userId}/insights?days=${days}`);
  if (!res.ok) throw new Error("Failed to fetch insights");
  return res.json();
}

// Phase 5.7 — Streak Leaderboard
export async function getHabitStreaks(userId: string): Promise<HabitStreak[]> {
  const res = await fetch(`${BASE_URL}/${userId}/habit-streaks`);
  if (!res.ok) throw new Error("Failed to fetch habit streaks");
  return res.json();
}
