import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoProvider } from "./contexts/DemoContext";
import MainLayout from "./layouts/MainLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/StatisticsPage";
import GalleryPage from "./pages/GalleryPage";
import ReflectionPage from "./pages/ReflectionPage";
import AiMentorPage from "./pages/AiMentorPage";
import HelpPage from "./pages/HelpPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* App routes */}
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/analytics" element={<MainLayout><AnalyticsPage /></MainLayout>} />
          <Route path="/gallery" element={<MainLayout><GalleryPage /></MainLayout>} />
          <Route path="/reflection" element={<MainLayout><ReflectionPage /></MainLayout>} />
          <Route path="/ai-mentor" element={<MainLayout><AiMentorPage /></MainLayout>} />
          <Route path="/help" element={<MainLayout><HelpPage /></MainLayout>} />
          <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DemoProvider>
    </BrowserRouter>
  );
}

export default App;
