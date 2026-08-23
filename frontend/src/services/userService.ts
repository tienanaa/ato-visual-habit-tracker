import type { User } from "../types/user";

const BASE_URL = "http://localhost:5000/api";

export async function getUser(userId: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to fetch user");
  }
  return res.json();
}
