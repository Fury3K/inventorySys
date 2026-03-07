"use client";
import { Search, Bell, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex items-center h-16 bg-base-100 border-b border-base-300/40 px-6 gap-4 relative z-10">
      {/* Search */}
      <div className="flex-1 max-w-lg relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30" size={16} />
        <input
          type="text"
          placeholder="Search products, transactions..."
          className="input bg-base-200/60 border-0 w-full pl-9 h-9 rounded-lg text-sm placeholder:text-base-content/30 focus:bg-base-200 focus:outline-primary/40 transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        <button className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content hover:bg-base-200/60">
          <div className="indicator">
            <Bell size={17} />
            <span className="badge badge-xs badge-primary indicator-item w-1.5 h-1.5 p-0 border-2 border-base-100"></span>
          </div>
        </button>

        {/* User Dropdown */}
        <div className="dropdown dropdown-end ml-1">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle btn-sm avatar ring-1 ring-base-300/60 ring-offset-1 ring-offset-base-100 hover:ring-primary/40 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <User size={15} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-1.5 shadow-lg bg-base-100 rounded-xl w-48 border border-base-300/50"
          >
            <div className="px-3 py-2.5 border-b border-base-200/60 mb-1">
              <p className="text-xs font-bold">Admin User</p>
              <p className="text-[10px] text-base-content/50">admin@xinc.com</p>
            </div>
            <li>
              <a className="rounded-lg text-xs py-2 hover:bg-base-200/60">
                <User size={13} className="text-base-content/50" /> Profile
              </a>
            </li>
            <li>
              <a className="rounded-lg text-xs py-2 hover:bg-base-200/60">
                <Settings size={13} className="text-base-content/50" /> Settings
              </a>
            </li>
            <div className="divider my-0.5 h-px"></div>
            <li>
              <a
                onClick={handleLogout}
                className="rounded-lg text-xs py-2 text-error hover:bg-error/8 cursor-pointer"
              >
                <LogOut size={13} /> Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
