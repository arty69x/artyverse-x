import { defineConfig } from "vitest/config";
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": `http://127.0.0.1:${process.env.ARTYVERSE_API_PORT || 4311}`,
    },
  },
  build: { target: "es2022" },
  test: { include: ["tests/unit/**/*.test.ts"] },
});
