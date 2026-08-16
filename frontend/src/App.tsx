import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DemoProvider } from "./contexts/DemoContext";
import MainLayout from "./layouts/MainLayout";

import LandingPage    from "./pages/LandingPage";
import LoginPage      from "./pages/LoginPage";
import DashboardPage  from "./pages/DashboardPage";
import HabitsPage     from "./pages/HabitsPage";
import StatisticsPage from "./pages/StatisticsPage";
import ReflectionPage from "./pages/ReflectionPage";
import GalleryPage    from "./pages/GalleryPage";
import SettingsPage   from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <DemoProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/"      element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* App routes — wrapped in MainLayout */}
          <Route path="/dashboard"  element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/habits"     element={<MainLayout><HabitsPage /></MainLayout>} />
          <Route path="/statistics" element={<MainLayout><StatisticsPage /></MainLayout>} />
          <Route path="/reflection" element={<MainLayout><ReflectionPage /></MainLayout>} />
          <Route path="/gallery"    element={<MainLayout><GalleryPage /></MainLayout>} />
          <Route path="/settings"   element={<MainLayout><SettingsPage /></MainLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DemoProvider>
    </BrowserRouter>
  );
}

export default App;
