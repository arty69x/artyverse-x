import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": `http://127.0.0.1:${process.env.ARTYVERSE_API_PORT || 4311}`,
    },
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: { app: "index.html", "browser-worker": "src/hosted/worker.ts" },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "browser-worker"
            ? "browser-worker.js"
            : "assets/[name]-[hash].js",
        manualChunks: {
          motion: ["motion/react"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
  test: { include: ["tests/unit/**/*.test.ts"] },
});
