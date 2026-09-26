@echo off
title Travel Guruji - Service Manager
echo ============================================================
echo   TRAVEL GURUJI - STARTING HYBRID BACKEND SERVICES
echo ============================================================
echo.
echo [1/2] Launching Python Intelligence Engine on port 8000...
start "Travel Guruji - Python Intelligence Engine (Port 8000)" cmd /k "python python_service/server.py"

REM Give Python a moment to bind port 8000
timeout /t 2 /nobreak >nul

echo [2/2] Launching Node.js Express Backend on port 5000...
start "Travel Guruji - Node.js Backend (Port 5000)" cmd /k "node backend/server.js"

echo.
echo ============================================================
echo   SERVICES LAUNCHED SUCCESSFULLY
echo ============================================================
echo   - Python Intelligence Engine : http://127.0.0.1:8000/health
echo   - Node.js Express API        : http://localhost:5000/api/health
echo.
echo   To launch the frontend React/Vite dev server, run:
echo     npm run dev
echo ============================================================
pause

