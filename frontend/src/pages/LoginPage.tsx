import { useState } from "react";
import { useDemo } from "../contexts/DemoContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react";

export default function LoginPage() {
  const { enterDemo } = useDemo();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 font-sans antialiased">
      {/* Back to home */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-bold text-3xl tracking-tight text-slate-800 select-none">
            Ato<span className="text-purple-600">.</span>
          </span>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              defaultValue="demo@example.com"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                defaultValue="demo123"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-btn"
            type="submit"
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-1"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Demo shortcut */}
        <button
          id="continue-as-demo-btn"
          onClick={enterDemo}
          className="w-full py-2.5 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg text-sm transition-all cursor-pointer"
        >
          Continue as Demo
        </button>

      </div>
    </div>
  );
}
