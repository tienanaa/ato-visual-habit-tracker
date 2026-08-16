export interface Habit {
  id: number;
  user_id: string;
  title: string;
  color_code: string;
  current_streak?: number;
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
