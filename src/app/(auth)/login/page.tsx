"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, Box } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      document.cookie = "session=demo; path=/";
      router.push("/");
    }, 1500);
  };

  return (
    <div className="bg-base-200 text-base-content font-sans antialiased min-h-screen flex">
      {/* Left Side: Branding & Context */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-primary text-primary-content">
        {/* Modern Creative Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-3xl"></div>
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-base-100 rounded-xl flex items-center justify-center shadow-xl text-primary">
            <Box size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tighter">X inc.</span>
        </div>

        {/* Value Proposition / Hero Text */}
        <div className="relative z-10 mb-20 space-y-6">
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
            Inventory <br/> Reimagined.
          </h1>
          <p className="text-primary-content/80 text-lg max-w-md font-medium">
            Streamline your workflow with intelligent stock tracking, seamless transactions, and beautiful analytics.
          </p>
        </div>
        
        {/* Subtle Footer */}
        <div className="relative z-10 font-medium text-primary-content/60 text-sm">
          &copy; 2026 X inc. Systems.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-base-100 relative">
        {/* Subtle ambient light for the form side */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg text-primary-content">
              <Box size={28} strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-base-content">X inc.</span>
          </div>

          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome back</h2>
            <p className="text-base-content/60">Log in to manage your workspace.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Email or Username</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 focus-within:outline-primary bg-base-200/50">
                <User size={18} className="text-base-content/40" />
                <input 
                  type="text" 
                  className="grow" 
                  placeholder="jdoe@example.com" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
                <a href="#" className="label-text-alt link link-primary font-medium">Forgot?</a>
              </label>
              <label className="input input-bordered flex items-center gap-3 focus-within:outline-primary bg-base-200/50">
                <Lock size={18} className="text-base-content/40" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="grow" 
                  placeholder="••••••••" 
                  required
                />
                <button 
                  type="button" 
                  className="text-base-content/40 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mt-2 mb-6">
              <label className="label cursor-pointer justify-start gap-3">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                <span className="label-text font-medium">Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn btn-primary w-full shadow-lg shadow-primary/30"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          {/* Support Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-base-content/50">
              Having trouble? <a href="#" className="link link-primary font-medium">Contact Support</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
