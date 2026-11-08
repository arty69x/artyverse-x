import { applyAccent } from "./accent";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ThemePreference, ResolvedTheme } from "../../shared/design";
const ThemeContext = createContext<{
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setTheme: (t: ThemePreference) => void;
}>({ preference: "dark", resolved: "dark", setTheme: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => {
      try {
        const p = localStorage.getItem("artyverse-theme");
        return p === "light" || p === "system" ? p : "dark";
      } catch {
        return "dark";
      }
    }),
    [system, setSystem] = useState<ResolvedTheme>(() =>
      matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    );
  const resolved = preference === "system" ? system : preference;
  useEffect(() => {
    const m = matchMedia("(prefers-color-scheme: dark)"),
      f = () => setSystem(m.matches ? "dark" : "light");
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    try {
      const accent = localStorage.getItem("av-accent");
      if (accent) applyAccent(accent);
    } catch {}
    document.documentElement.style.colorScheme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", resolved === "dark" ? "#080B12" : "#F3F5FA");
  }, [resolved]);
  return (
    <ThemeContext.Provider
      value={{
        preference,
        resolved,
        setTheme: (p) => {
          setPreference(p);
          try {
            localStorage.setItem("artyverse-theme", p);
          } catch {}
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
