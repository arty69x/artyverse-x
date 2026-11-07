import { spawn } from "node:child_process";
const children = [
  spawn(process.execPath, ["--experimental-strip-types", "server/index.ts"], {
    stdio: "inherit",
    env: { ...process.env, PORT: process.env.ARTYVERSE_API_PORT || "4311" },
  }),
  spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "0.0.0.0",
      "--port",
      process.env.ARTYVERSE_WEB_PORT || "5173",
      "--strictPort",
    ],
    { stdio: "inherit" },
  ),
];
let stopping = false;
const stop = () => {
  if (stopping) return;
  stopping = true;
  children.forEach((c) => c.kill());
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
children.forEach((c) =>
  c.on("exit", (code) => {
    stop();
    process.exitCode = code || 0;
  }),
);
