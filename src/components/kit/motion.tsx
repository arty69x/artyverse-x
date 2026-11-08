import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import { useStore } from "../../core/store";
const Policy = createContext(false);
export function PreviewMotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion(),
    { motion } = useStore(),
    [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <Policy.Provider
      value={!reduced && visible && !["Off", "Calm"].includes(motion)}
    >
      {children}
    </Policy.Provider>
  );
}
export const usePreviewMotion = () => useContext(Policy);
