"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, Box, AlertCircle } from "lucide-react";
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
    <div className="bg-base-200 text-base-content font-sans antialiased min-h-screen flex items-stretch overflow-hidden relative">
      {/* Theme Toggle for Login Page */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-base-100/50 backdrop-blur-md rounded-full border border-base-200/60 shadow-sm p-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Left Side: Branding & Context */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col bg-primary text-primary-content">
        {/* Modern Creative Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-[35rem] h-[35rem] bg-secondary/20 rounded-full blur-3xl"></div>
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Content Container - Vertically Centered */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-16 xl:px-24">
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-base-100 rounded-xl flex items-center justify-center shadow-2xl text-primary">
              <Box size={28} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black tracking-tighter">X inc.</span>
          </div>

          {/* Value Proposition / Hero Text */}
          <div className="space-y-8">
            <h1 className="text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Inventory <br/> Reimagined.
            </h1>
            <div className="w-20 h-1.5 bg-secondary rounded-full"></div>
            <p className="text-primary-content/80 text-xl max-w-md font-medium leading-relaxed">
              Streamline your workflow with intelligent stock tracking, seamless transactions, and beautiful analytics.
            </p>
          </div>
        </div>
        
        {/* Footer Area - Absolute at bottom */}
        <div className="relative z-10 p-12 font-medium text-primary-content/60 text-sm">
          &copy; 2026 X inc. Systems.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 bg-base-100 relative">
        {/* Subtle ambient light */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md relative z-10 py-12">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-12 justify-center">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl text-primary-content">
              <Box size={32} strokeWidth={2.5} />
            </div>
            <span className="text-4xl font-black tracking-tighter text-base-content">X inc.</span>
          </div>

          {/* Header */}
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Welcome back</h2>
            <p className="text-base-content/60 text-lg">Log in to manage your workspace.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-6 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={20} />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-sm uppercase tracking-wide opacity-70">Username</span>
              </label>
              <label className="input input-bordered h-14 flex items-center gap-4 focus-within:outline-primary bg-base-200/40 border-base-200/60 rounded-2xl transition-all">
                <User size={20} className="text-base-content/30" />
                <input 
                  type="text" 
                  className="grow font-medium" 
                  placeholder="admin" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-sm uppercase tracking-wide opacity-70">Password</span>
                <a href="#" className="label-text-alt link link-primary font-bold">Forgot?</a>
              </label>
              <label className="input input-bordered h-14 flex items-center gap-4 focus-within:outline-primary bg-base-200/40 border-base-200/60 rounded-2xl transition-all">
                <Lock size={20} className="text-base-content/30" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="grow font-medium" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="text-base-content/30 hover:text-base-content transition-colors mr-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-2 mb-8">
              <label className="label cursor-pointer justify-start gap-4">
                <input type="checkbox" className="checkbox checkbox-primary rounded-lg" />
                <span className="label-text font-semibold opacity-80">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary h-14 w-full shadow-2xl shadow-primary/40 rounded-2xl text-lg font-bold"
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          {/* Support Footer */}
          <div className="mt-12 text-center">
            <p className="text-base font-medium text-base-content/50">
              Having trouble? <a href="#" className="link link-primary font-bold">Contact Support</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
