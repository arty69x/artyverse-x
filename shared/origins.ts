export const PRIMARY_ORIGIN = "https://artyverse-x.vercel.app";
export const LEGACY_ORIGIN = "https://artyverse-x-ai-assistant.vercel.app";
export function validOrigin(value: string | undefined, fallback: string) {
  try {
    const u = new URL(value || fallback);
    if (
      u.origin !== (value || fallback) ||
      !(
        u.protocol === "https:" ||
        (u.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(u.hostname))
      )
    )
      throw Error();
    return u.origin;
  } catch {
    return fallback;
  }
}

export function safeHash(s: string | null | undefined) {
  return s && /^#\/[a-z-]+(?:\/[a-zA-Z0-9_-]+)?$/.test(s) ? s : "#/home";
}
export function primaryLink(
  mainOrigin: string,
  hash: string,
  fromLegacy = false,
) {
  return mainOrigin + "/" + (fromLegacy ? "?from=legacy" : "") + safeHash(hash);
}

export const originMapKey = (source: string) =>
  "av-origin-map:" + encodeURIComponent(source);
export function resolveOriginId(
  storage: Pick<Storage, "getItem">,
  source: string,
  id: string | undefined,
) {
  if (!id) return id;
  try {
    const m = JSON.parse(storage.getItem(originMapKey(source)) || "null");
    const to =
      m?.schemaVersion === 1 && m.sourceOrigin === source ? m.ids?.[id] : null;
    return typeof to === "string" && /^[a-z0-9-]{36}$/.test(to) ? to : id;
  } catch {
    return id;
  }
}
