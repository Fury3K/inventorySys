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
      // For demo purposes, just set a cookie and redirect
      document.cookie = "session=demo; path=/";
      router.push("/");
    }, 1500);
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex">
      {/* Left Side: Branding & Context (Hidden on mobile, visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-[#1e3a8a]">
        {/* Custom subtle background pattern logic via inline style since we are in React */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        ></div>
        
        {/* Abstract glowing orb effect */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg text-blue-600">
            <Box size={24} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">X inc.</span>
        </div>

        {/* Value Proposition / Hero Text */}
        <div className="relative z-10 mb-20">
          <h1 className="text-4xl font-bold text-white leading-tight mb-6">
            Manage your inventory<br />with absolute precision.
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            Access real-time stock levels, track shipments, and forecast demand from a single, centralized dashboard.
          </p>
        </div>
        
        {/* Subtle Footer */}
        <div className="relative z-10 text-blue-100/60 text-sm">
          &copy; 2026 X inc. Systems. Internal Use Only.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo (Hidden on desktop) */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md text-white">
              <Box size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">X inc.</span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Please enter your credentials to access your account.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">Username or Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200" 
                  placeholder="e.g. jdoe or admin@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  required 
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200" 
                  placeholder="••••••••"
                />
                
                {/* Toggle Password Visibility Button */}
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Extra Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign in to Inventory'}</span>
              {isLoading && (
                <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </button>
          </form>

          {/* Support Footer */}
          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              Don't have an account or need help? <br className="sm:hidden" />
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Contact System Administrator</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
