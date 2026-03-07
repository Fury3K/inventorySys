"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"winter" | "night">("winter");

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
      className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content hover:bg-base-200/60 transition-all"
      aria-label="Toggle Theme"
    >
      <div className="swap swap-rotate">
        {theme === "winter" ? (
          <Moon size={17} className="transition-transform duration-300" />
        ) : (
          <Sun size={17} className="transition-transform duration-300" />
        )}
      </div>
    </button>
  );
}
