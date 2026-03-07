"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  ClipboardList,
  LogOut,
  Box,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Master List", href: "/admin/products", icon: Package },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Inventory", href: "/admin/inventory", icon: ClipboardList },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-60 flex-col bg-base-100 border-r border-base-300/40 relative z-20">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 gap-2.5 border-b border-base-300/40">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content shadow-sm">
          <Box size={16} strokeWidth={2.5} />
        </div>
        <span className="text-base font-bold tracking-tight">X inc.</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-base-content/40">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-content shadow-sm"
                      : "text-base-content/60 hover:bg-base-200/80 hover:text-base-content"
                  )}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight size={14} className="opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-base-300/40">
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm w-full justify-start gap-2.5 text-base-content/50 hover:text-error hover:bg-error/8 rounded-lg text-[13px] font-medium h-9"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
