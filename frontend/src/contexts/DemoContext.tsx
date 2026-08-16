import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Fixed UUID matching seed.sql — no backend call needed
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_USER_NAME = "Demo User";
const STORAGE_KEY = "ato_demo_session";

interface DemoContextType {
  isDemo: boolean;
  userId: string;
  userName: string;
  enterDemo: () => void;
  exitDemo: () => void;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const navigate = useNavigate();

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsDemo(true);
    }
  }, []);

  const enterDemo = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsDemo(true);
    navigate("/dashboard");
  };

  const exitDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsDemo(false);
    navigate("/");
  };

  return (
    <DemoContext.Provider
      value={{
        isDemo,
        userId: DEMO_USER_ID,
        userName: DEMO_USER_NAME,
        enterDemo,
        exitDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
