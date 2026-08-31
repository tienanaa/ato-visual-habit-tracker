// Stats types — được mở rộng dần qua Phase 5.1 → 5.7

// Phase 5.1 — Summary Cards
export interface StatsSummary {
  totalHabits: number;
  currentStreak: number;
  completedToday: number;
  completionRateToday: number; // 0–100
}

// Phase 5.2 — Activity Heatmap + Line Chart
export interface DailyCompletion {
  date: string;           // 'YYYY-MM-DD'
  completedCount: number;
  totalHabits: number;
}

// Phase 5.3 — Donut Chart
export interface HabitDistribution {
  habitId: number;
  title: string;
  colorCode: string;
  totalCompletions: number;
}

// Phase 5.4 — Mood Bar Chart
export interface MoodStat {
  mood: string; // 'happy' | 'sad' | 'excited' | 'neutral' | 'angry'
  days: number;
}

// Phase 5.6 — Insight Cards
export interface StatsInsights {
  bestHabit: { title: string; completionRate: number } | null;
  bestWeekday: { dayName: string; perfectDays: number } | null;
  dominantMood: { mood: string; days: number } | null;
}

// Phase 5.7 — Streak Leaderboard
export interface HabitStreak {
  habitId: number;
  title: string;
  colorCode: string;
  currentStreak: number;
  longestStreak: number;
}
