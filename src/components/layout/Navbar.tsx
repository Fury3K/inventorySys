"use client";
import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6 h-16">
      <div className="flex-1">
        <div className="form-control relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" size={18} />
          <input
            type="text"
            placeholder="Search products, transactions..."
            className="input input-bordered w-full pl-10 h-10"
          />
        </div>
      </div>
      <div className="flex-none gap-4">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <Bell size={20} />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
              <User size={24} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
          >
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a className="text-error">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
