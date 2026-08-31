import { useEffect, useState } from "react";
import { useDemo } from "../contexts/DemoContext";
import { getStatsSummary } from "../services/stats.service";
import SummaryCards from "../components/stats/SummaryCards";
import type { StatsSummary } from "../types/stats";

export default function StatisticsPage() {
  const { userId } = useDemo();
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSummaryLoading(true);
    setError(null);

    getStatsSummary(userId)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load statistics. Make sure the backend is running.");
      })
      .finally(() => {
        if (!cancelled) setSummaryLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      {/* Page Header */}
      <div>

      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* 5.1 — Summary Cards */}
      <SummaryCards data={summary} loading={summaryLoading} />

      {/* Placeholder cho các phase tiếp theo */}
    </div>
  );
}

