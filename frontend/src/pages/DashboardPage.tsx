import { useEffect, useRef, useState } from "react";
import { CheckSquare, SmileySad, ArrowUUpLeft } from "@phosphor-icons/react";
import { useDemo } from "../contexts/DemoContext";
import { getHabits, createHabit, deleteHabit, updateHabit } from "../services/habitService";
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
      // If leaving the page with a pending delete, execute it immediately
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
      // If server delete fails, restore habit back and display error
      setHabits((prev) => [...prev, habit]);
      setError(`Failed to delete "${habit.title}". Please try again.`);
    }
  };

  const handleDelete = (habitId: number) => {
    // If there is already an item pending deletion, commit it now
    if (pendingDeleteRef.current) {
      clearTimeout(pendingDeleteRef.current.timerId);
      executeDelete(pendingDeleteRef.current.habit);
      setPendingDelete(null);
    }

    const index = habits.findIndex((h) => h.id === habitId);
    if (index === -1) return;

    const targetHabit = habits[index];

    // Optimistically remove from UI
    setHabits((prev) => prev.filter((h) => h.id !== habitId));

    // Start 2-second countdown before sending DELETE request to server
    const timerId = setTimeout(() => {
      executeDelete(targetHabit);
      setPendingDelete(null);
    }, 2000);

    setPendingDelete({ habit: targetHabit, index, timerId });
  };

  const handleUndo = () => {
    if (!pendingDelete) return;

    clearTimeout(pendingDelete.timerId);

    // Re-insert habit at its original position
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

  return (
    <div className="max-w-2xl relative">
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
          onClick={() => setShowCreateModal(true)}
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
      {!loading && !error && habits.length === 0 && !pendingDelete && (
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
            <HabitCard
              key={habit.id}
              habit={habit}
              onDelete={handleDelete}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* Minimal Undo Toast */}
      {pendingDelete && (
        <button
          id="undo-delete-btn"
          onClick={handleUndo}
          aria-label="Undo delete habit"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-3.5 py-2
            bg-[#1e1e1e] text-white rounded-xl shadow-xl border border-white/10 hover:bg-[#282828]
            active:scale-95 transition-all duration-150 cursor-pointer animate-in fade-in slide-in-from-bottom-3"
        >
          <span className="text-sm font-medium text-slate-100">Habit deleted</span>
          <ArrowUUpLeft size={16} weight="bold" className="text-amber-400" />
        </button>
      )}

      {/* Create Habit Modal */}
      {showCreateModal && (
        <HabitFormModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleHabitCreated}
          onSubmit={(title, colorCode) => createHabit(userId, title, colorCode)}
        />
      )}

      {/* Edit Habit Modal */}
      {editingHabit && (
        <HabitFormModal
          initialData={editingHabit}
          onClose={() => setEditingHabit(null)}
          onUpdated={handleHabitUpdated}
          onSubmit={(title, colorCode) => updateHabit(editingHabit.id, title, colorCode)}
        />
      )}
    </div>
  );
}
