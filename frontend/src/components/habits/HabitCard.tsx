import { Fire } from "@phosphor-icons/react";
import type { Habit } from "../../types/habit";

// Map color_code from DB → Tailwind classes
const COLOR_MAP: Record<string, { accent: string; badge: string; text: string }> = {
  purple: { accent: "bg-purple-500",  badge: "bg-purple-50 text-purple-700 border-purple-200",  text: "text-purple-600" },
  orange: { accent: "bg-orange-400",  badge: "bg-orange-50 text-orange-700 border-orange-200",  text: "text-orange-600" },
  blue:   { accent: "bg-blue-500",    badge: "bg-blue-50   text-blue-700   border-blue-200",    text: "text-blue-600"   },
  teal:   { accent: "bg-teal-500",    badge: "bg-teal-50   text-teal-700   border-teal-200",    text: "text-teal-600"   },
  red:    { accent: "bg-rose-500",    badge: "bg-rose-50   text-rose-700   border-rose-200",    text: "text-rose-600"   },
  green:  { accent: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-600" },
};

const DEFAULT_COLOR = COLOR_MAP.purple;

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const colors = COLOR_MAP[habit.color_code] ?? DEFAULT_COLOR;

  return (
    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
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
      {habit.current_streak > 0 && (
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold shrink-0 ${colors.badge}`}>
          <Fire size={13} weight="fill" />
          <span>{habit.current_streak}d</span>
        </div>
      )}
    </div>
  );
}
