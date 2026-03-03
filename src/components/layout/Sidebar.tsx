"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  ClipboardList, 
  Settings,
  LogOut,
  Box
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Master List", href: "/admin/products", icon: Package },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { name: "Inventory", href: "/admin/inventory", icon: ClipboardList },
];

import { logout } from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-base-100 text-base-content border-r border-base-200/60 shadow-sm relative z-20">
      <div className="flex h-20 items-center justify-start border-b border-base-200/60 px-6 gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content shadow-sm">
          <Box size={18} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">X inc.</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="menu w-full px-3 gap-1.5 font-medium">
          <li className="menu-title px-4 pb-2 text-xs uppercase tracking-wider text-base-content/50 font-bold">Main Menu</li>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                  )}
                >
                  <Icon size={18} className={isActive ? "text-primary" : "text-base-content/50"} />
                  <span className={isActive ? "font-bold" : ""}>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-base-200/60 p-4">
        <button 
          onClick={handleLogout}
          className="btn btn-ghost w-full justify-start gap-3 text-base-content/70 hover:text-error hover:bg-error/10 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
