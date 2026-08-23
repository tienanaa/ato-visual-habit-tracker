export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  custom_reminder?: string | null;
  current_streak: number;
  created_at: string;
}
