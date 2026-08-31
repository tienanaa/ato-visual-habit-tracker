import { useEffect, useState, useCallback } from "react";
import { Bell, Fire, SignOut } from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
import { useDemo } from "../contexts/DemoContext";
import { getUser } from "../services/userService";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/statistics":  "Statistics",
  "/gallery":    "Gallery",
  "/reflection": "Reflection",
  "/ai-mentor":  "AI Mentor",
  "/help":       "Help",
  "/settings":   "Settings",
};

export default function Header() {
  const { pathname } = useLocation();
  const { userId, userName, exitDemo } = useDemo();
  const [streak, setStreak] = useState<number>(0);

  const title = PAGE_TITLES[pathname] ?? "";
  const initial = userName.charAt(0).toUpperCase();

  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    try {
      const user = await getUser(userId);
      setStreak(user.current_streak ?? 0);
    } catch {
      // Giữ giá trị mặc định nếu chưa fetch được
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();

    const handleStreakUpdated = () => {
      fetchUserData();
    };

    window.addEventListener("streak-updated", handleStreakUpdated);
    return () => {
      window.removeEventListener("streak-updated", handleStreakUpdated);
    };
  }, [fetchUserData]);

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex justify-between items-center z-10 sticky top-0">
      {/* Page Title */}
      <span className="text-lg font-bold text-slate-800 tracking-tight">
        {title}
      </span>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-sm font-semibold select-none">
          <Fire size={16} weight="fill" className="text-orange-500" />
          <span>{streak} {streak === 1 ? "day" : "days"}</span>
        </div>

        {/* Notification */}
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">{userName}</div>
            <div className="text-xs text-purple-500 font-medium">Demo Mode</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200">
            {initial}
          </div>
        </div>

        {/* Exit Demo */}
        <button
          id="exit-demo-btn"
          onClick={exitDemo}
          title="Exit Demo"
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
        >
          <SignOut size={20} />
        </button>
      </div>
    </header>
  );
}
