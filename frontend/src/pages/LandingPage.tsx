import { useNavigate } from "react-router-dom";
import { useDemo } from "../contexts/DemoContext";
import {
  CheckCircle,
  ChartBar,
  BookBookmark,
  ArrowRight,
  Fire,
} from "@phosphor-icons/react";

const features = [
  {
    icon: CheckCircle,
    title: "Track Habits",
    description:
      "Build daily habits with a simple, visual checklist. Small steps, consistent progress.",
    color: "purple",
  },
  {
    icon: ChartBar,
    title: "View Progress",
    description:
      "See your streaks, completion rates, and growth over time with clean charts.",
    color: "orange",
  },
  {
    icon: BookBookmark,
    title: "Write Diary",
    description:
      "Reflect on your day and capture moments that matter — all in one place.",
    color: "teal",
  },
];

const colorMap: Record<string, string> = {
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  orange: "bg-orange-50 text-orange-600 border-orange-100",
  teal: "bg-teal-50 text-teal-600 border-teal-100",
};

export default function LandingPage() {
  const { enterDemo } = useDemo();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
      {/* Header*/}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-100 px-6 h-16 flex items-center justify-between">
        <span className="font-bold text-2xl tracking-tight text-slate-800 select-none">
          Ato<span className="text-purple-600">.</span>
        </span>
        <button
          onClick={() => navigate("/login")}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Login
        </button>
      </header>

      {/* Hero*/}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold rounded-full">
          <Fire size={13} weight="fill" className="text-orange-500" />
          Kaizen — small steps, big results
        </div>

        <h1 className="text-5xl font-bold !text-slate-900">
          Build habits that{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">
            actually stick
          </span>
        </h1>

        <p className="text-lg text-slate-500 max-w-md mb-6 leading-relaxed">
          A visual habit tracker inspired by the Kaizen philosophy — track your
          daily progress, reflect, and grow one day at a time.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            id="try-demo-btn"
            onClick={enterDemo}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Try Demo
            <ArrowRight size={16} weight="bold" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
          >
            Login
          </button>
        </div>

      </section>

      {/* Feature Cards */}
      <section className="px-6 pt-16 pb-24 max-w-4xl mx-auto w-full">
        <div className="grid sm:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 ${colorMap[color]}`}
              >
                <Icon size={20} weight="duotone" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1.5">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
