import { useEffect, useRef, useState } from "react";
import { X, Plus, PencilSimple } from "@phosphor-icons/react";
import type { Habit } from "../../types/habit";

const COLOR_OPTIONS: {
  key: string;
  label: string;
  bg: string;
  ring: string;
}[] = [
  { key: "purple", label: "Purple", bg: "bg-purple-500", ring: "ring-purple-600" },
  { key: "orange", label: "Orange", bg: "bg-orange-400", ring: "ring-orange-500" },
  { key: "blue", label: "Blue", bg: "bg-blue-500", ring: "ring-blue-600" },
  { key: "teal", label: "Teal", bg: "bg-teal-500", ring: "ring-teal-600" },
  { key: "red", label: "Red", bg: "bg-rose-500", ring: "ring-rose-600" },
  { key: "green", label: "Green", bg: "bg-emerald-500", ring: "ring-emerald-600" },
];

interface HabitFormModalProps {
  onClose: () => void;
  onCreated?: (habit: Habit) => void;
  onUpdated?: (habit: Habit) => void;
  onSubmit: (title: string, colorCode: string) => Promise<Habit>;
  initialData?: Habit;
}

export default function HabitFormModal({
  onClose,
  onCreated,
  onUpdated,
  onSubmit,
  initialData,
}: HabitFormModalProps) {
  const isEditMode = initialData !== undefined;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [colorCode, setColorCode] = useState(initialData?.color_code ?? "purple");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Auto-focus title on mount
  useEffect(() => {
    inputRef.current?.focus();
    if (isEditMode && inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditMode]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Click backdrop to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Habit name cannot be empty.");
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savedHabit = await onSubmit(trimmed, colorCode);
      if (isEditMode) {
        onUpdated?.(savedHabit);
      } else {
        onCreated?.(savedHabit);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-modal-title"
    >
      <div className="relative w-full max-w-md mx-4 rounded-xl border border-slate-200 bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 id="habit-modal-title" className="text-base font-bold text-slate-800">
              {isEditMode ? "Edit Habit" : "New Habit"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? "Update the name or color of your habit."
                : "Build a routine, one day at a time."}
            </p>
          </div>
          <button
            id="habit-modal-close"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Title field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="habit-title"
                className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
              >
                Habit Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="habit-title"
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Morning meditation"
                maxLength={120}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-slate-800 placeholder:text-slate-400
                  outline-none transition-colors
                  focus:border-purple-600 focus:bg-white
                  ${error ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
              />
              {error && (
                <p role="alert" className="text-xs text-rose-500 font-medium mt-0.5">
                  {error}
                </p>
              )}
            </div>

            {/* Color picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Color
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    id={`habit-color-${c.key}`}
                    title={c.label}
                    aria-label={`Select color ${c.label}`}
                    aria-pressed={colorCode === c.key}
                    onClick={() => setColorCode(c.key)}
                    className={`w-7 h-7 rounded-full ${c.bg} transition-all focus:outline-none ${
                      colorCode === c.key
                        ? `ring-2 ring-offset-2 ${c.ring}`
                        : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200 bg-slate-50">
            <button
              id="habit-modal-cancel"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 rounded-lg border border-slate-200 bg-white
                hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="habit-modal-submit"
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg
                bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span
                    className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  {isEditMode ? "Saving…" : "Creating…"}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <PencilSimple size={14} weight="bold" />
                  ) : (
                    <Plus size={14} weight="bold" />
                  )}
                  {isEditMode ? "Save Changes" : "Create Habit"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
