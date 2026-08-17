import { useEffect, useState } from "react";
import { CheckSquare, SmileySad } from "@phosphor-icons/react";
import { useDemo } from "../contexts/DemoContext";
import { getHabits, createHabit, deleteHabit } from "../services/habitService";
import HabitCard from "../components/habits/HabitCard";
import HabitFormModal from "../components/habits/HabitFormModal";
import type { Habit } from "../types/habit";

export default function DashboardPage() {
  const { userId } = useDemo();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleHabitCreated = (newHabit: Habit) => {
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleDelete = async (habitId: number) => {
    await deleteHabit(habitId);
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

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

        {/* Add Habit button */}
        <button
          id="add-habit-btn"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl
            hover:bg-purple-700 active:scale-95 transition-all duration-150 shadow-sm shadow-purple-200"
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
          <p className="text-xs">Click "Add Habit" to get started.</p>
        </div>
      )}

      {/* Habits list */}
      {!loading && !error && habits.length > 0 && (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Habit Modal */}
      {showModal && (
        <HabitFormModal
          onClose={() => setShowModal(false)}
          onCreated={handleHabitCreated}
          onSubmit={(title, colorCode) => createHabit(userId, title, colorCode)}
        />
      )}
    </div>
  );
}

