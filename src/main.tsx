import React from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/jetbrains-mono/latin-400.css";

import "@fontsource/dm-sans/latin-200.css";
import "@fontsource/dm-sans/latin-300.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-800.css";
import "@fontsource/dm-sans/latin-800-italic.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-700.css";
import { Provider } from "./core/store";
import { App } from "./App";
import "./style.css";
import "./tokens.css";
import "./v2/style.css";
import "./v3/tokens.css";
import "./v3/style.css";
import { ThemeProvider } from "./v3/Theme";
import { prepareBrowserStorage } from "./hosted/mode";
async function boot() {
  await prepareBrowserStorage();
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <Provider>
          <App />
        </Provider>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
void boot().catch((e) => {
  const root = document.getElementById("root")!;
  const title = document.createElement("h1");
  title.textContent = "ไม่สามารถเริ่มพื้นที่จัดเก็บ / Storage unavailable";
  const message = document.createElement("p");
  message.textContent = String(e);
  const retry = document.createElement("button");
  retry.textContent = "โหลดใหม่ / Reload";
  retry.onclick = () => location.reload();
  root.append(title, message, retry);
});

import "./v3/reconstruction.css";

import "./v3/typography.css";
