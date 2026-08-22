import { Fire, Trash, PencilSimple, Check, Clock } from "@phosphor-icons/react";
import type { Habit } from "../../types/habit";

const COLOR_MAP: Record<string, { accent: string; badge: string; text: string }> = {
  purple: { accent: "bg-purple-500", badge: "bg-purple-50 text-purple-700 border-purple-200", text: "text-purple-600" },
  orange: { accent: "bg-orange-400", badge: "bg-orange-50 text-orange-700 border-orange-200", text: "text-orange-600" },
  blue: { accent: "bg-blue-500", badge: "bg-blue-50   text-blue-700   border-blue-200", text: "text-blue-600" },
  teal: { accent: "bg-teal-500", badge: "bg-teal-50   text-teal-700   border-teal-200", text: "text-teal-600" },
  red: { accent: "bg-rose-500", badge: "bg-rose-50   text-rose-700   border-rose-200", text: "text-rose-600" },
  green: { accent: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-600" },
};

const DEFAULT_COLOR = COLOR_MAP.purple;

function formatReminder(timeStr?: string | null): string {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${minutes} ${ampm}`;
}

interface HabitCardProps {
  habit: Habit;
  onDelete?: (habitId: number) => void;
  onEdit?: (habit: Habit) => void;
  onToggle?: (habitId: number, isCompleted: boolean) => void;
}

export default function HabitCard({ habit, onDelete, onEdit, onToggle }: HabitCardProps) {
  const colors = COLOR_MAP[habit.color_code] ?? DEFAULT_COLOR;
  const isCompleted = habit.is_completed_today ?? false;

  const handleDeleteClick = () => {
    onDelete?.(habit.id);
  };

  const handleToggleClick = () => {
    onToggle?.(habit.id, !isCompleted);
  };

  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border transition-colors group ${isCompleted
          ? "bg-slate-50 border-slate-200"
          : "bg-white border-slate-200 hover:border-slate-300"
        }`}
    >
      {/* Color accent strip */}
      <div className={`w-1 self-stretch rounded-full ${colors.accent} shrink-0`} />

      {/* Complete Checkbox Toggle */}
      <button
        type="button"
        id={`toggle-habit-${habit.id}`}
        onClick={handleToggleClick}
        aria-label={isCompleted ? `Mark ${habit.title} as incomplete` : `Mark ${habit.title} as complete`}
        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 cursor-pointer ${isCompleted
            ? `${colors.accent} text-white`
            : "border border-slate-300 bg-white"
          }`}
      >
        {isCompleted && <Check size={13} weight="bold" />}
      </button>

      {/* Habit info */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-sm truncate ${isCompleted ? " text-slate-400" : "text-slate-800"
            }`}
        >
          {habit.title}
        </p>

        {habit.description && (
          <p
            className={`text-xs mt-0.5 line-clamp-1 ${isCompleted ? "text-slate-400" : "text-slate-500"
              }`}
          >
            {habit.description}
          </p>
        )}

        <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1 flex-wrap">
          <span>
            Since {new Date(habit.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>

          {habit.reminder_time && (
            <span className="flex items-center gap-1 text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
              <Clock size={11} weight="bold" className="text-slate-400" />
              {formatReminder(habit.reminder_time)}
            </span>
          )}
        </div>
      </div>

      {/* Streak badge */}
      {(habit.current_streak ?? 0) > 0 && (
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold shrink-0 ${colors.badge}`}>
          <Fire size={13} weight="fill" />
          <span>{habit.current_streak}d</span>
        </div>
      )}

      {/* Action buttons — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            id={`edit-habit-${habit.id}`}
            onClick={() => onEdit(habit)}
            aria-label={`Edit ${habit.title}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <PencilSimple size={15} weight="bold" />
          </button>
        )}
        {onDelete && (
          <button
            id={`delete-habit-${habit.id}`}
            onClick={handleDeleteClick}
            aria-label={`Delete ${habit.title}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
          >
            <Trash size={15} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}
