import React, { createContext, useContext, useEffect, useState } from "react";
import type { Item } from "../../shared/schema";
export async function request<T = any>(
  path: string,
  body?: unknown,
  method?: string,
): Promise<T> {
  const r = await fetch("/api" + path, {
    method: method || (body ? "POST" : "GET"),
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const value = await r.json();
  if (!r.ok) throw Error(value.error || "Request failed");
  return value;
}
export function download(
  name: string,
  content: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
type Store = {
  items: Item[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  create: (
    kind: Item["kind"],
    title: string,
    data: Record<string, any>,
  ) => Promise<Item>;
  save: (item: Item) => Promise<Item>;
  trash: (item: Item, restore?: boolean) => Promise<void>;
  notice: string;
  toast: (s: string) => void;
  locale: "en" | "th";
  setLocale: (s: "en" | "th") => void;
  motion: string;
  setMotion: (s: string) => void;
};
const Context = createContext<Store>(null!);
export function Provider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, toast] = useState(""),
    [locale, setLocaleState] = useState<"en" | "th">(() =>
      localStorage.getItem("av-locale") === "th" ? "th" : "en",
    ),
    [motion, setMotionState] = useState(
      () => localStorage.getItem("av-motion") || "Balanced",
    );
  async function refresh() {
    try {
      setItems(await request("/items"));
      setError("");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void refresh();
    const accent = localStorage.getItem("av-accent");
    if (accent && /^#[0-9a-f]{6}$/i.test(accent))
      document.documentElement.style.setProperty("--accent", accent);
  }, []);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => toast(""), 5000);
      return () => clearTimeout(t);
    }
  }, [notice]);
  function upsert(item: Item) {
    setItems((old) => [item, ...old.filter((i) => i.id !== item.id)]);
    return item;
  }
  async function create(
    kind: Item["kind"],
    title: string,
    data: Record<string, any>,
  ) {
    return upsert(await request("/items", { kind, title, data }));
  }
  async function save(item: Item) {
    const result = upsert(
      await request(
        "/items/" + item.id,
        {
          kind: item.kind,
          title: item.title,
          data: item.data,
          revision: item.revision,
        },
        "PUT",
      ),
    );
    toast(locale === "th" ? "บันทึกในเครื่องแล้ว" : "Saved to this workspace");
    return result;
  }
  async function trash(item: Item, restore = false) {
    try {
      upsert(await request("/items/" + item.id + "/trash", { restore }));
      toast(restore ? "Restored" : "Moved to trash — restore from Library");
    } catch (e) {
      toast(String(e));
    }
  }
  return (
    <Context.Provider
      value={{
        items,
        loading,
        error,
        refresh,
        create,
        save,
        trash,
        notice,
        toast,
        locale,
        setLocale: (s) => {
          localStorage.setItem("av-locale", s);
          setLocaleState(s);
        },
        motion,
        setMotion: (s) => {
          localStorage.setItem("av-motion", s);
          setMotionState(s);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
export const useT = () => {
  const { locale } = useStore();
  return (en: string, th: string) => (locale === "th" ? th : en);
};
export function useDraft<T>(
  key: string,
  initial: T,
): [T, (v: T | ((old: T) => T)) => void, () => void] {
  const { toast } = useStore();
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem("av-draft:" + key);
      if (!raw) return initial;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed !== typeof initial) throw Error("Invalid draft type");
        return parsed as T;
      } catch {
        try {
          localStorage.setItem("av-recovery:" + key, raw);
        } catch {}
        return initial;
      }
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("av-draft:" + key, JSON.stringify(value));
    } catch {
      toast(
        "Browser draft storage unavailable or full. Save to the workspace or export your work.",
      );
    }
  }, [key, value]);
  return [value, setValue, () => localStorage.removeItem("av-draft:" + key)];
}
export async function upload(file: Blob, name = "Media") {
  if (file.size > 25 * 1024 * 1024) throw Error("Maximum file size is 25 MB");
  const r = await fetch("/api/assets", {
    method: "POST",
    headers: {
      "Content-Type": file.type || "audio/webm",
      "X-Filename": encodeURIComponent(name),
    },
    body: file,
  });
  const result = await r.json();
  if (!r.ok) throw Error(result.error);
  return result;
}
