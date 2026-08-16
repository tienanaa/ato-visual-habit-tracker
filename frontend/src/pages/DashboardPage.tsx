import { useEffect, useState } from "react";
import { CheckSquare, SmileySad } from "@phosphor-icons/react";
import { useDemo } from "../contexts/DemoContext";
import { getHabits } from "../services/habitService";
import HabitCard from "../components/habits/HabitCard";
import type { Habit } from "../types/habit";

export default function DashboardPage() {
  const { userId } = useDemo();
  const [habits, setHabits]   = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getHabits(userId)
      .then((data) => {
        if (!cancelled) setHabits(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load habits. Make sure the backend is running.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Habits</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? "Loading…" : `${habits.length} habit${habits.length !== 1 ? "s" : ""} tracked`}
          </p>
        </div>

        {/* Add Habit — placeholder until Task 3.2 */}
        <button
          disabled
          title="Coming soon"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl opacity-40 cursor-not-allowed select-none"
        >
          <CheckSquare size={16} weight="bold" />
          Add Habit
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm mb-4">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && habits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 gap-3">
          <SmileySad size={40} weight="thin" />
          <p className="text-sm font-medium">No habits yet.</p>
          <p className="text-xs">Add your first habit to get started.</p>
        </div>
      )}

      {/* Habits list */}
      {!loading && !error && habits.length > 0 && (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
