export const browserEdition =
  (import.meta as any).env.VITE_STORAGE_MODE === "browser";
export async function prepareBrowserStorage() {
  if (!browserEdition) return;
  if (!("serviceWorker" in navigator) || !("indexedDB" in window))
    throw Error(
      "Browser-local storage requires service workers and IndexedDB. Use a supported HTTPS browser or the local server edition.",
    );
  await navigator.serviceWorker.register("/browser-worker.js", {
    type: "module",
    scope: "/",
  });
  await navigator.serviceWorker.ready;
  if (!navigator.serviceWorker.controller)
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          changed,
        );
        reject(
          Error(
            "Browser storage could not start. Reload or use the local server edition.",
          ),
        );
      }, 15000);
      const changed = () => {
        clearTimeout(timeout);
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          changed,
        );
        resolve();
      };
      navigator.serviceWorker.addEventListener("controllerchange", changed);
      if (navigator.serviceWorker.controller) changed();
    });
}
