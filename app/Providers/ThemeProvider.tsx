// src/contexts/ThemeContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";

interface ThemeType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeType | null>(null);

// Create a custom hook for easy consumption
export const useTheme = () => {
  const themeContext = useContext(ThemeContext);
  if (themeContext === null) {
    throw Error("Please wrap the component first");
  }
  return themeContext;
};

// Create the Theme Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state based on localStorage or system preference
  // const [isDarkMode, setIsDarkMode] = useState(() => {
  //     const savedTheme = localStorage.getItem('theme');
  //     if (savedTheme) {
  //         return savedTheme === 'dark';
  //     }
  //     // Check system preference if no saved theme
  //     return window.matchMedia('(prefers-color-scheme: dark)').matches;
  // });

  const [isDarkMode, setIsDarkMode] = useState(true);

  // Effect to apply or remove 'dark' class on <html> element
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]); // Re-run effect whenever isDarkMode changes

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Provide the state and toggle function to children components
  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
