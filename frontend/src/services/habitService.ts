import type { Habit, HabitLog } from "../types/habit";

const BASE_URL = "http://localhost:5000/api";

export async function getHabits(userId: string): Promise<Habit[]> {
  const res = await fetch(`${BASE_URL}/habits/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

export async function createHabit(
  userId: string,
  title: string,
  colorCode: string
): Promise<Habit> {
  const res = await fetch(`${BASE_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, title, color_code: colorCode }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to create habit");
  }
  return res.json();
}

export async function deleteHabit(habitId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/habits/${habitId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to delete habit");
  }
}

export async function logHabit(
  habitId: number,
  userId: string,
  logDate: string
): Promise<HabitLog> {
  const res = await fetch(`${BASE_URL}/habits/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ habit_id: habitId, user_id: userId, log_date: logDate }),
  });
  if (!res.ok) throw new Error("Failed to log habit");
  const data = await res.json();
  return data.data;
}

