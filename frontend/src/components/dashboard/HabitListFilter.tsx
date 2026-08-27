type FilterMode = "all" | "pending" | "done";

interface HabitListFilterProps {
  filter: FilterMode;
  onChange: (filter: FilterMode) => void;
  total: number;
  completed: number;
}

interface TabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function Tab({ label, count, active, onClick }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "bg-purple-600 text-white"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`}
    >
      {label}
      {active && (
        <span className="text-xs font-normal text-purple-200 ml-0.5">
          {count}
        </span>
      )}
    </button>
  );
}

export default function HabitListFilter({
  filter,
  onChange,
  total,
  completed,
}: HabitListFilterProps) {
  const pending = total - completed;

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
      <Tab
        label="All"
        count={total}
        active={filter === "all"}
        onClick={() => onChange("all")}
      />
      <Tab
        label="Pending"
        count={pending}
        active={filter === "pending"}
        onClick={() => onChange("pending")}
      />
      <Tab
        label="Done"
        count={completed}
        active={filter === "done"}
        onClick={() => onChange("done")}
      />
    </div>
  );
}
