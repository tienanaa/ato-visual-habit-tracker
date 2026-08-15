import { Bell, Fire } from "@phosphor-icons/react";

interface HeaderProps {
  currentTab: string;
  userName?: string;
  userAvatar?: string;
  streakCount?: number;
}

export default function Header({
  currentTab,
  userName = "Lamie",
  userAvatar,
  streakCount = 5,
}: HeaderProps) {
  const getTabLabel = (tabId: string) => {
    switch (tabId) {
      case "dashboard":
        return "Dashboard";
      case "analytics":
        return "Analytics";
      case "gallery":
        return "Gallery";
      case "reflection":
        return "Reflection";
      case "ai-mentor":
        return "Al mentor";
      case "help":
        return "Help";
      case "settings":
        return "Setting";
      default:
        return "";
    }
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex justify-between items-center z-10 sticky top-0">
      {/* Left side: Active Page Title */}
      <div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">
          {getTabLabel(currentTab)}
        </span>
      </div>

      {/* Right Navigation & Profile */}
      <div className="flex items-center gap-4">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-xl text-sm font-bold shadow-sm select-none">
          <Fire size={16} weight="fill" className="text-orange-500" />
          <span>{streakCount} days</span>
        </div>

        {/* Notification Icon */}
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">{userName}</div>
          </div>
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
