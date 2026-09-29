import { spawn } from "child_process";

console.log("\n==================================================");
console.log("🚀 Starting Travel_Guruji Live Full-Stack Dev Engine");
console.log("   - Backend API & Live Weather Sync: http://localhost:5000");
console.log("   - Frontend Application (Vite):     http://localhost:5173");
console.log("==================================================\n");

// Spawn backend server
const backend = spawn("node", ["backend/server.js"], {
  stdio: "inherit",
  shell: true,
});

// Spawn frontend Vite server
const frontend = spawn("npx", ["vite"], {
  stdio: "inherit",
  shell: true,
});

function handleExit(code = 0) {
  try {
    if (backend && !backend.killed) backend.kill();
  } catch {}
  try {
    if (frontend && !frontend.killed) frontend.kill();
  } catch {}
  process.exit(code);
}

backend.on("error", (err) => {
  console.error("Backend process error:", err);
});

frontend.on("error", (err) => {
  console.error("Frontend process error:", err);
});

process.on("SIGINT", () => handleExit(0));
process.on("SIGTERM", () => handleExit(0));
process.on("exit", () => handleExit(0));
