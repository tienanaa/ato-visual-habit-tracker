import Header from "./Header";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
  streakCount?: number;
  userName?: string;
}

export default function MainLayout({
  children,
  currentTab,
  onTabChange,
  streakCount,
  userName = "Lamie",
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-600 overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentTab={currentTab} onTabChange={onTabChange} />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header currentTab={currentTab} userName={userName} streakCount={streakCount} />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-slate-50 overflow-y-auto text-left">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
