import React from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/jetbrains-mono/latin-400.css";


import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-700.css";
import { Provider } from "./core/store";
import { App } from "./App";
import "./style.css";
import "./tokens.css";
import "./v2/style.css";
import "./v3/tokens.css";
import "./v3/style.css";
import {ThemeProvider} from "./v3/Theme";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider><Provider>
      <App />
    </Provider></ThemeProvider>
  </React.StrictMode>,
);
