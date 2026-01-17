import { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light';
  setTheme: (theme: 'light') => void;
  resolvedTheme: 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always light mode - no dark mode support
  const theme = 'light' as const;
  const resolvedTheme = 'light' as const;
  const setTheme = () => {}; // No-op since we only support light mode

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
