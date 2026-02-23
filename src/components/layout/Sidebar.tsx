"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  ClipboardList, 
  Settings,
  LogOut
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-base-200 text-base-content border-r border-base-300">
      <div className="flex h-16 items-center justify-center border-b border-base-300 px-4">
        <h1 className="text-xl font-bold text-primary">X inc.</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="menu w-full px-4 gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-content hover:bg-primary/90" 
                      : "hover:bg-base-300"
                  )}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t border-base-300 p-4">
        <button className="btn btn-ghost w-full justify-start gap-3 text-error hover:bg-error/10">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
