import { ListChecks, CheckCircle, HourglassHigh } from "@phosphor-icons/react";

interface DashboardStatsRowProps {
  total: number;
  completed: number;
  pending: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

function StatCard({ icon, label, value, colorClass, bgClass, borderClass }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border ${bgClass} ${borderClass}`}
    >
      <div className={`shrink-0 ${colorClass}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardStatsRow({ total, completed, pending }: DashboardStatsRowProps) {
  return (
    <div className="flex gap-3">
      <StatCard
        icon={<ListChecks size={20} weight="bold" />}
        label="Total Habits"
        value={total}
        colorClass="text-slate-500"
        bgClass="bg-white"
        borderClass="border-slate-200"
      />
      <StatCard
        icon={<CheckCircle size={20} weight="fill" />}
        label="Completed"
        value={completed}
        colorClass="text-emerald-500"
        bgClass="bg-emerald-50"
        borderClass="border-emerald-200"
      />
      <StatCard
        icon={<HourglassHigh size={20} weight="fill" />}
        label="Pending"
        value={pending}
        colorClass="text-amber-500"
        bgClass="bg-amber-50"
        borderClass="border-amber-200"
      />
    </div>
  );
}
