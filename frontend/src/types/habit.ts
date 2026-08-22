export interface Habit {
  id: number;
  user_id: string;
  title: string;
  color_code: string;
  description?: string | null;
  reminder_time?: string | null;
  current_streak?: number;
  is_completed_today?: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: number;
  user_id: string;
  is_completed: boolean;
  log_date: string;
  created_at: string;
}
