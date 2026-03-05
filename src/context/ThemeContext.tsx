import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage first
    const saved = localStorage.getItem("develevator-theme") as Theme;
    if (saved) return saved;
    // Default to dark for this app since that's the established aesthetic
    return "dark";
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    localStorage.setItem("develevator-theme", theme);

    const root = window.document.documentElement;
    
    // Determine actual color mode (resolving "system")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedIsDark = theme === "system" ? systemPrefersDark : theme === "dark";
    
    setIsDark(resolvedIsDark);

    // Apply the DaisyUI data-theme and standard .dark class for Tailwind v4
    if (resolvedIsDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      document.body.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      document.body.setAttribute("data-theme", "light");
    }
  }, [theme]);

  // Listen for system preference changes if in system mode
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemDark = mediaQuery.matches;
      setIsDark(systemDark);
      
      if (systemDark) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
