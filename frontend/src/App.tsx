import { useState } from "react";
import MainLayout from "./layouts/MainLayout";

function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <div className="text-slate-500 font-medium">Dashboard content area.</div>;
      case "analytics":
        return <div className="text-slate-500 font-medium">Analytics charts and data will show up here.</div>;
      case "gallery":
        return <div className="text-slate-500 font-medium">Your uploaded diary images will be shown here.</div>;
      case "reflection":
        return <div className="text-slate-500 font-medium">Write and review your daily reflections here.</div>;
      case "ai-mentor":
        return <div className="text-slate-500 font-medium">Interact with your AI Kaizen Mentor here.</div>;
      case "help":
        return <div className="text-slate-500 font-medium">Help center and usage guides.</div>;
      case "settings":
        return <div className="text-slate-500 font-medium">App configurations and profile settings.</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <MainLayout currentTab={currentTab} onTabChange={setCurrentTab} streakCount={5}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;

