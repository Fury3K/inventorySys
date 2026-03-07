"use client";
import { Search, Bell, User, Settings, LogOut, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import SearchModal from "./SearchModal";
import { logout } from "@/lib/auth";
import { getLowStockProducts } from "@/lib/actions";

export default function Navbar() {
  const router = useRouter();
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    getLowStockProducts().then(setLowStock).catch(() => {});
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <SearchModal />
      <header className="flex items-center h-16 bg-base-100 border-b border-base-300/40 px-6 gap-4 relative z-10">
        {/* Search trigger */}
        <button
          onClick={() => {
            // Dispatch Ctrl+K to open modal
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
          }}
          className="flex-1 max-w-lg relative flex items-center gap-2 h-9 px-3 rounded-lg bg-base-200/60 hover:bg-base-200 transition-colors cursor-text"
        >
          <Search size={16} className="text-base-content/30" />
          <span className="text-sm text-base-content/30 flex-1 text-left">Search…</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-semibold text-base-content/25 bg-base-300/40 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Notification Bell */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content hover:bg-base-200/60">
              <div className="indicator">
                <Bell size={17} />
                {lowStock.length > 0 && (
                  <span className="badge badge-xs badge-warning indicator-item w-4 h-4 text-[9px] font-bold border-2 border-base-100">
                    {lowStock.length}
                  </span>
                )}
              </div>
            </div>
            <div tabIndex={0} className="dropdown-content mt-3 z-[1] shadow-lg bg-base-100 rounded-xl w-72 border border-base-300/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-base-200/60 flex items-center gap-2">
                <AlertTriangle size={14} className="text-warning" />
                <span className="text-xs font-bold">Low Stock Alerts</span>
                <span className="badge badge-xs badge-warning ml-auto">{lowStock.length}</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {lowStock.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-base-content/30">All stock levels are healthy</div>
                ) : (
                  lowStock.map((p) => (
                    <a
                      key={p.id}
                      href="/admin/inventory"
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-200/40 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${(p.currentStock ?? 0) <= 0 ? "bg-error" : "bg-warning"}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{p.name}</div>
                        <div className="text-[10px] text-base-content/40 font-mono">{p.stockNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${(p.currentStock ?? 0) <= 0 ? "text-error" : "text-warning"}`}>{p.currentStock ?? 0}</div>
                        <div className="text-[9px] text-base-content/35">min {p.minStock ?? 10}</div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* User Dropdown */}
          <div className="dropdown dropdown-end ml-1">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm avatar ring-1 ring-base-300/60 ring-offset-1 ring-offset-base-100 hover:ring-primary/40 transition-all">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User size={15} />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-1.5 shadow-lg bg-base-100 rounded-xl w-48 border border-base-300/50">
              <div className="px-3 py-2.5 border-b border-base-200/60 mb-1">
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-base-content/50">admin@xinc.com</p>
              </div>
              <li><a className="rounded-lg text-xs py-2 hover:bg-base-200/60"><User size={13} className="text-base-content/50" /> Profile</a></li>
              <li><a className="rounded-lg text-xs py-2 hover:bg-base-200/60"><Settings size={13} className="text-base-content/50" /> Settings</a></li>
              <div className="divider my-0.5 h-px"></div>
              <li><a onClick={handleLogout} className="rounded-lg text-xs py-2 text-error hover:bg-error/8 cursor-pointer"><LogOut size={13} /> Sign out</a></li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
