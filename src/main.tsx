import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/noto-sans-thai/thai-400.css";
import { Provider } from "./core/store";
import { App } from "./App";
import "./style.css";
import "./tokens.css";
import "./v2/style.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
);
