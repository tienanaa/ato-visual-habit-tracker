import {
  House,
  ChartBar,
  Image,
  ArrowsClockwise,
  Sparkle,
  Question,
  Gear,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const mainMenuItems = [
  { path: "/dashboard",  label: "Dashboard",  icon: House },
  { path: "/analytics",  label: "Analytics",  icon: ChartBar },
  { path: "/gallery",    label: "Gallery",    icon: Image },
  { path: "/reflection", label: "Reflection", icon: ArrowsClockwise },
  { path: "/ai-mentor",  label: "AI Mentor",  icon: Sparkle },
];

const bottomMenuItems = [
  { path: "/help",     label: "Help",     icon: Question },
  { path: "/settings", label: "Settings", icon: Gear },
];

export default function Sidebar() {
  const renderLink = (item: { path: string; label: string; icon: any }) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `w-full flex items-center gap-3 px-6 py-3 font-medium text-sm transition-all duration-150 relative ${
            isActive
              ? "text-purple-600 bg-purple-50/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
          } ${styles.navItem}`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-600 rounded-r-md" />
            )}
            <Icon size={20} weight={isActive ? "fill" : "regular"} />
            <span>{item.label}</span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Top: Logo & Main Nav */}
      <div className="flex flex-col">
        <div className="p-6 pt-8">
          <span className="font-bold text-3xl tracking-tight text-slate-800">
            Ato<span className="text-purple-600">.</span>
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          {mainMenuItems.map(renderLink)}
        </div>
      </div>

      {/* Bottom: Settings */}
      <div className="flex flex-col gap-1 mb-6">
        {bottomMenuItems.map(renderLink)}
      </div>
    </aside>
  );
}
