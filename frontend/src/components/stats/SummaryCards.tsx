import { ListChecks, Flame, CheckCircle, ChartPie } from "@phosphor-icons/react";
import type { StatsSummary } from "../../types/stats";

interface SummaryCardsProps {
  data: StatsSummary | null;
  loading: boolean;
}

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

function Card({ icon, label, value, colorClass, bgClass, borderClass }: CardProps) {
  return (
    <div className={`flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border ${bgClass} ${borderClass}`}>
      <div className={`shrink-0 ${colorClass}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex-1 h-[60px] bg-slate-100 rounded-xl animate-pulse" />
  );
}

export default function SummaryCards({ data, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const totalHabits = data?.totalHabits ?? 0;
  const currentStreak = data?.currentStreak ?? 0;
  const completedToday = data?.completedToday ?? 0;
  const completionRateToday = data?.completionRateToday ?? 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card
        icon={<ListChecks size={20} weight="bold" />}
        label="Total Habits"
        value={totalHabits}
        colorClass="text-slate-500"
        bgClass="bg-white"
        borderClass="border-slate-200"
      />
      <Card
        icon={<Flame size={20} weight="fill" />}
        label="Current Streak"
        value={`${currentStreak}d`}
        colorClass="text-orange-500"
        bgClass="bg-orange-50"
        borderClass="border-orange-200"
      />
      <Card
        icon={<CheckCircle size={20} weight="fill" />}
        label="Done Today"
        value={`${completedToday} / ${totalHabits}`}
        colorClass="text-emerald-500"
        bgClass="bg-emerald-50"
        borderClass="border-emerald-200"
      />
      <Card
        icon={<ChartPie size={20} weight="fill" />}
        label="Rate Today"
        value={`${completionRateToday}%`}
        colorClass="text-purple-600"
        bgClass="bg-purple-50"
        borderClass="border-purple-200"
      />
    </div>
  );
}
