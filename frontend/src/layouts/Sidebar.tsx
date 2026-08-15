import { House, ChartBar, Image, BookBookmark, Robot, Question, Gear } from "@phosphor-icons/react";

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "analytics", label: "Analytics", icon: ChartBar },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "reflection", label: "Reflection", icon: BookBookmark },
    { id: "ai-mentor", label: "Al mentor", icon: Robot },
  ];

  const bottomMenuItems = [
    { id: "help", label: "Help", icon: Question },
    { id: "settings", label: "Setting", icon: Gear },
  ];

  const renderMenuItem = (item: { id: string; label: string; icon: any }) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={`w-full flex items-center gap-3 px-6 py-3 font-medium text-sm transition-all duration-150 cursor-pointer relative ${
          isActive
            ? "text-purple-600 bg-purple-50/50"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
        }`}
      >
        {/* Left vertical border indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-600 rounded-r-md" />
        )}
        <Icon size={20} weight={isActive ? "fill" : "regular"} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Top Section: Logo & Main Navigation */}
      <div className="flex flex-col">
        {/* Logo "Ato." */}
        <div className="p-6 pt-8">
          <span className="font-bold text-3xl tracking-tight text-slate-800">
            Ato<span className="text-purple-600">.</span>
          </span>
        </div>

        {/* Main Menu Items */}
        <div className="flex flex-col gap-1 mt-4">
          {mainMenuItems.map(renderMenuItem)}
        </div>
      </div>

      {/* Bottom Section: Help & Setting */}
      <div className="flex flex-col gap-1 mb-6">
        {bottomMenuItems.map(renderMenuItem)}
      </div>
    </aside>
  );
}
