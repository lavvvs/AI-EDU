# AI Educational Assistant - Unified Startup Script

Write-Host "--- AI Educational Assistant Premium Startup ---" -ForegroundColor Cyan

# Cleanup: Kill any existing backend/frontend processes to avoid port and DB conflicts
Write-Host "Shutting down existing instances..." -ForegroundColor Gray
Stop-Process -Name "python", "uvicorn" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Manual cleanup for Qdrant lock if any
$qdrantLock = "./qdrant_db/.lock"
if (Test-Path $qdrantLock) {
    Remove-Item -Force $qdrantLock -ErrorAction SilentlyContinue
    Write-Host "Cleared stale Qdrant lock." -ForegroundColor Gray
}

# Start Backend (FastAPI) with Logging
Write-Host "Starting Backend on http://localhost:8000..." -ForegroundColor Cyan
# Starting backend with reload and binding to all interfaces for better connection stability
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn app.main:app --port 8000 --host 0.0.0.0 --reload 2>&1 | Tee-Object backend_srv.log"

# Wait for backend to at least initialize
Start-Sleep -Seconds 3

# Start Frontend (Next.js SaaS UI)
Write-Host "Starting Premium Frontend on http://localhost:3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`n--- Services are starting ---" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000 (Access this one)" -ForegroundColor Yellow
Write-Host "-------------------------------------------"
