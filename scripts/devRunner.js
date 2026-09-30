import { spawn } from "child_process";
import fs from "fs";
import path from "path";

console.log("\n==================================================");
console.log("🚀 Starting Travel_Guruji Live Full-Stack Dev Engine");
console.log("   - Backend API & Live Weather Sync: http://localhost:5000");
console.log("   - Python Intelligence Microservice: http://localhost:8000");
console.log("   - Frontend Application (Vite):     http://localhost:5173");
console.log("==================================================\n");

// Determine Python virtual environment executable
const venvPythonWin = path.join(process.cwd(), "python-intelligence", ".venv", "Scripts", "python.exe");
const venvPythonUnix = path.join(process.cwd(), "python-intelligence", ".venv", "bin", "python");
const pythonCmd = fs.existsSync(venvPythonWin)
  ? venvPythonWin
  : fs.existsSync(venvPythonUnix)
  ? venvPythonUnix
  : "python";

// Spawn Python Intelligence Layer
const pythonService = spawn(pythonCmd, ["python-intelligence/app.py"], {
  stdio: "inherit",
  shell: true,
});

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
    if (pythonService && !pythonService.killed) pythonService.kill();
  } catch {}
  try {
    if (backend && !backend.killed) backend.kill();
  } catch {}
  try {
    if (frontend && !frontend.killed) frontend.kill();
  } catch {}
  process.exit(code);
}

pythonService.on("error", (err) => {
  console.warn("Python Intelligence Service notice:", err.message);
});

backend.on("error", (err) => {
  console.error("Backend process error:", err);
});

frontend.on("error", (err) => {
  console.error("Frontend process error:", err);
});

process.on("SIGINT", () => handleExit(0));
process.on("SIGTERM", () => handleExit(0));
process.on("exit", () => handleExit(0));
