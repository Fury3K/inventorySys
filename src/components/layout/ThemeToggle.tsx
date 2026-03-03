"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"winter" | "night">("winter");

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "winter" | "night" | null;
    const initialTheme = savedTheme || "winter";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "winter" ? "night" : "winter";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle text-base-content/70 hover:text-base-content hover:bg-base-200/50"
      aria-label="Toggle Theme"
    >
      {theme === "winter" ? (
        <Moon size={20} className="transition-all" />
      ) : (
        <Sun size={20} className="transition-all" />
      )}
    </button>
  );
}
