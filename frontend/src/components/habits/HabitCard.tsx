import { useState } from "react";
import { Fire, Trash, X, Warning } from "@phosphor-icons/react";
import type { Habit } from "../../types/habit";

const COLOR_MAP: Record<string, { accent: string; badge: string; text: string }> = {
  purple: { accent: "bg-purple-500", badge: "bg-purple-50 text-purple-700 border-purple-200", text: "text-purple-600" },
  orange: { accent: "bg-orange-400", badge: "bg-orange-50 text-orange-700 border-orange-200", text: "text-orange-600" },
  blue:   { accent: "bg-blue-500",   badge: "bg-blue-50   text-blue-700   border-blue-200",   text: "text-blue-600"   },
  teal:   { accent: "bg-teal-500",   badge: "bg-teal-50   text-teal-700   border-teal-200",   text: "text-teal-600"   },
  red:    { accent: "bg-rose-500",   badge: "bg-rose-50   text-rose-700   border-rose-200",   text: "text-rose-600"   },
  green:  { accent: "bg-emerald-500",badge: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-600" },
};

const DEFAULT_COLOR = COLOR_MAP.purple;

interface HabitCardProps {
  habit: Habit;
  onDelete?: (habitId: number) => Promise<void>;
}

export default function HabitCard({ habit, onDelete }: HabitCardProps) {
  const colors = COLOR_MAP[habit.color_code] ?? DEFAULT_COLOR;

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = () => {
    setDeleteError(null);
    setConfirming(true);
  };

  const handleCancelDelete = () => {
    setConfirming(false);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(habit.id);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete.");
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Color accent strip */}
        <div className={`w-1 self-stretch rounded-full ${colors.accent} shrink-0`} />

        {/* Habit info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{habit.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Since {new Date(habit.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Streak badge */}
        {(habit.current_streak ?? 0) > 0 && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold shrink-0 ${colors.badge}`}>
            <Fire size={13} weight="fill" />
            <span>{habit.current_streak}d</span>
          </div>
        )}

        {/* Delete button — visible on hover */}
        {onDelete && !confirming && (
          <button
            id={`delete-habit-${habit.id}`}
            onClick={handleDeleteClick}
            aria-label={`Delete ${habit.title}`}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50
              opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0"
          >
            <Trash size={15} weight="bold" />
          </button>
        )}
      </div>

      {/* Inline confirm bar */}
      {confirming && (
        <div className="flex items-center gap-3 px-5 py-2.5 bg-rose-50 border-t border-rose-100 text-sm">
          <Warning size={15} className="text-rose-500 shrink-0" weight="fill" />
          <span className="text-rose-700 text-xs font-medium flex-1">Delete this habit?</span>
          <button
            id={`cancel-delete-${habit.id}`}
            onClick={handleCancelDelete}
            disabled={deleting}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600
              rounded-lg border border-slate-200 hover:bg-white transition-colors disabled:opacity-40"
          >
            <X size={11} weight="bold" />
            Cancel
          </button>
          <button
            id={`confirm-delete-${habit.id}`}
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white
              bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors disabled:opacity-60"
          >
            {deleting ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash size={11} weight="bold" />
            )}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}

      {/* Error bar */}
      {deleteError && (
        <div className="px-5 py-2 bg-rose-50 border-t border-rose-100 text-xs text-rose-600 font-medium">
          {deleteError}
        </div>
      )}
    </div>
  );
}
