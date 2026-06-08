"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read theme from localStorage or default to system preference
    try {
      const savedTheme = localStorage.getItem("lala-theme") as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(systemPrefersDark ? "dark" : "light");
      }
    } catch (e) {
      console.error("Failed to read theme", e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("lala-theme", theme);
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
