"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, Box, AlertCircle, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const result = await login(formData);
      if (result?.success) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-base-100 relative">
      {/* Theme Toggle */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col bg-primary text-primary-content">
        {/* Abstract background shapes */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-white/[0.07] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/[0.03] rounded-full blur-2xl"></div>
        </div>

        {/* Dot pattern overlay */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 xl:px-16">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 bg-base-100 rounded-xl flex items-center justify-center text-primary">
              <Box size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">X inc.</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
              Inventory<br />Reimagined.
            </h1>
            <div className="w-12 h-1 bg-secondary/80 rounded-full"></div>
            <p className="text-primary-content/70 text-lg max-w-sm leading-relaxed">
              Intelligent stock tracking, seamless transactions, and real-time analytics — all in one place.
            </p>
          </div>
        </div>

        <div className="relative z-10 px-12 pb-8 text-sm text-primary-content/40">
          &copy; 2026 X inc. Systems.
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-12 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-content">
              <Box size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">X inc.</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-base-content/50 mt-1.5 text-sm">Sign in to your workspace</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3 mb-6 rounded-xl bg-error/10 text-error text-sm animate-scale-in">
              <AlertCircle size={16} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1.5 block">
                Username
              </label>
              <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/40 border-base-300/50 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <User size={16} className="text-base-content/30" />
                <input
                  type="text"
                  className="grow text-sm"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-1.5 block">
                Password
              </label>
              <label className="input input-bordered h-11 flex items-center gap-3 bg-base-200/40 border-base-300/50 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <Lock size={16} className="text-base-content/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="grow text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="text-base-content/30 hover:text-base-content/60 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-xs checkbox-primary rounded" />
                <span className="text-xs text-base-content/60">Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all gap-2"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-base-content/40">
            Need help? <a href="#" className="text-primary font-semibold hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
