# Travel Guruji - PowerShell Launcher for Backend & Python Intelligence Services
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  TRAVEL GURUJI - STARTING HYBRID BACKEND SERVICES" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Launching Python Intelligence Engine on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python python_service/server.py"

Start-Sleep -Seconds 2

Write-Host "[2/2] Launching Node.js Express Backend on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node backend/server.js"

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  SERVICES LAUNCHED" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Python Intelligence : http://127.0.0.1:8000/health" -ForegroundColor White
Write-Host "  Node.js API         : http://localhost:5000/api/health" -ForegroundColor White
Write-Host "`nTo start frontend in this shell, run: npm run dev`n" -ForegroundColor Gray

