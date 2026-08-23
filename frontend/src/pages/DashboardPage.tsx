import { useEffect, useRef, useState } from "react";
import { Plus, SmileySad, ArrowUUpLeft, CheckCircle } from "@phosphor-icons/react";
import { useDemo } from "../contexts/DemoContext";
import { getHabits, createHabit, deleteHabit, updateHabit, logHabit, unlogHabit } from "../services/habitService";
import HabitCard from "../components/habits/HabitCard";
import HabitFormModal from "../components/habits/HabitFormModal";
import type { Habit } from "../types/habit";

interface PendingDelete {
  habit: Habit;
  index: number;
  timerId: ReturnType<typeof setTimeout>;
}

export default function DashboardPage() {
  const { userId } = useDemo();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit modal
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Undo delete state
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const pendingDeleteRef = useRef<PendingDelete | null>(null);
  pendingDeleteRef.current = pendingDelete;

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

    return () => {
      cancelled = true;
      if (pendingDeleteRef.current) {
        clearTimeout(pendingDeleteRef.current.timerId);
        deleteHabit(pendingDeleteRef.current.habit.id).catch(console.error);
      }
    };
  }, [userId]);

  const handleHabitCreated = (newHabit: Habit) => {
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleHabitUpdated = (updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
    );
  };

  const executeDelete = async (habit: Habit) => {
    try {
      await deleteHabit(habit.id);
    } catch {
      setHabits((prev) => [...prev, habit]);
      setError(`Failed to delete "${habit.title}". Please try again.`);
    }
  };

  const handleDelete = (habitId: number) => {
    if (pendingDeleteRef.current) {
      clearTimeout(pendingDeleteRef.current.timerId);
      executeDelete(pendingDeleteRef.current.habit);
      setPendingDelete(null);
    }

    const index = habits.findIndex((h) => h.id === habitId);
    if (index === -1) return;

    const targetHabit = habits[index];

    setHabits((prev) => prev.filter((h) => h.id !== habitId));

    const timerId = setTimeout(() => {
      executeDelete(targetHabit);
      setPendingDelete(null);
    }, 2000);

    setPendingDelete({ habit: targetHabit, index, timerId });
  };

  const handleUndo = () => {
    if (!pendingDelete) return;

    clearTimeout(pendingDelete.timerId);

    setHabits((prev) => {
      const next = [...prev];
      const insertAt = Math.min(pendingDelete.index, next.length);
      next.splice(insertAt, 0, pendingDelete.habit);
      return next;
    });

    setPendingDelete(null);
  };

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleToggleHabit = async (habitId: number, isCompleted: boolean) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, is_completed_today: isCompleted } : h
      )
    );

    const today = new Date().toISOString().split("T")[0];

    try {
      if (isCompleted) {
        await logHabit(habitId, userId, today);
      } else {
        await unlogHabit(habitId, userId, today);
      }
      window.dispatchEvent(new CustomEvent("streak-updated"));
    } catch {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, is_completed_today: !isCompleted } : h
        )
      );
      setError("Failed to update habit status. Please try again.");
    }
  };

  // Progress metrics
  const completedCount = habits.filter((h) => h.is_completed_today).length;
  const totalCount = habits.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Today's Habits</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Add Habit button */}
        <button
          id="add-habit-btn"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={16} weight="bold" />
          Add Habit
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Today's Progress Card (Flat Design) */}
      {!loading && totalCount > 0 && (
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-purple-600" />
              <span className="text-sm font-semibold text-slate-800">Daily Progress</span>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              {completedCount} of {totalCount} completed ({progressPercentage}%)
            </span>
          </div>

          {/* Flat Progress Bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 border border-slate-200 rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && totalCount === 0 && !pendingDelete && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-2 border border-dashed border-slate-200 rounded-xl bg-white">
          <SmileySad size={36} weight="thin" />
          <p className="text-sm font-medium text-slate-600">No habits tracked yet.</p>
          <p className="text-xs text-slate-400">Click "Add Habit" to start your daily routine.</p>
        </div>
      )}

      {/* Habits list */}
      {!loading && !error && totalCount > 0 && (
        <div className="flex flex-col gap-2.5">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onDelete={handleDelete}
              onEdit={handleEditClick}
              onToggle={handleToggleHabit}
            />
          ))}
        </div>
      )}

      {/* Minimal Undo Toast (Flat Design) */}
      {pendingDelete && (
        <button
          id="undo-delete-btn"
          onClick={handleUndo}
          aria-label="Undo delete habit"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-3.5 py-2
            bg-neutral-900 text-white rounded-lg border border-neutral-800 hover:bg-neutral-800
            transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium text-slate-200">Habit deleted</span>
          <ArrowUUpLeft size={16} weight="bold" className="text-amber-400" />
        </button>
      )}

      {/* Create Habit Modal */}
      {showCreateModal && (
        <HabitFormModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleHabitCreated}
          onSubmit={(title, colorCode, description, reminderTime) =>
            createHabit(userId, title, colorCode, description, reminderTime)
          }
        />
      )}

      {/* Edit Habit Modal */}
      {editingHabit && (
        <HabitFormModal
          initialData={editingHabit}
          onClose={() => setEditingHabit(null)}
          onUpdated={handleHabitUpdated}
          onSubmit={(title, colorCode, description, reminderTime) =>
            updateHabit(editingHabit.id, title, colorCode, description, reminderTime)
          }
        />
      )}
    </div>
  );
}
