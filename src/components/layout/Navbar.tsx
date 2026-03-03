"use client";
import { Search, Bell, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear the session cookie
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-200/60 px-6 h-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)] relative z-10">
      <div className="flex-1">
        <div className="form-control relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search products, transactions..."
            className="input bg-base-200/50 border-transparent focus:border-primary focus:bg-base-100 w-full pl-11 h-11 rounded-full text-sm font-medium transition-all"
          />
        </div>
      </div>
      <div className="flex-none gap-3">
        <button className="btn btn-ghost btn-circle text-base-content/70 hover:text-base-content hover:bg-base-200/50">
          <div className="indicator">
            <Bell size={20} />
            <span className="badge badge-xs badge-primary indicator-item scale-75 border-2 border-base-100"></span>
          </div>
        </button>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-base-200 ring-offset-2 ring-offset-base-100 hover:ring-primary/30 transition-all">
            <div className="w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-4 z-[1] p-2 shadow-xl bg-base-100 rounded-2xl w-56 border border-base-200/60 font-medium"
          >
            <div className="px-4 py-3 border-b border-base-200/60 mb-2">
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-base-content/60">admin@xinc.com</p>
            </div>
            <li>
              <a className="py-2.5 px-4 rounded-xl hover:bg-base-200/50">
                <User size={16} className="text-base-content/60" /> Profile
              </a>
            </li>
            <li>
              <a className="py-2.5 px-4 rounded-xl hover:bg-base-200/50">
                <Settings size={16} className="text-base-content/60" /> Settings
              </a>
            </li>
            <div className="divider my-1"></div>
            <li>
              <a 
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-xl text-error hover:bg-error/10 hover:text-error cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
