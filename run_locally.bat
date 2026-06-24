@echo off
title BODHIQ Automatic Runner
cls
echo ====================================================================
echo                 BODHIQ FULLY AUTOMATED RUNNER
echo ====================================================================
echo.
echo [INFO] Detecting system environment...

:: Check if Docker daemon is running
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Docker daemon is running. Selecting Best Option: Docker Compose.
    goto run_docker
) else (
    echo [WARNING] Docker daemon is not running!
    echo [INFO] Falling back to Local Process Runner using Python and Node.js...
    goto run_local
)

:run_docker
echo.
echo [INFO] Starting services via Docker Compose...
echo [INFO] Build and server logs will be streamed in this window.
echo [INFO] A minimized background monitor has been launched to open the browser once ready.
echo.

:: Launch the minimized browser monitor in the background using a clean, safe PowerShell command
start "BODHIQ Browser Monitor" /min powershell -Command "while ($true) { try { Invoke-WebRequest -Uri 'http://localhost' -UseBasicParsing -TimeoutSec 2 >$null; start 'http://localhost'; break } catch { Start-Sleep -Seconds 3 } }"

:: Start Docker Compose in the foreground so the user sees all build progress and logs
docker compose up --build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker compose failed to start.
    echo [INFO] Please make sure Docker Desktop is open and running.
    pause
)
goto end

:run_local
echo.
echo [INFO] Starting backend and frontend locally in separate windows...
echo [INFO] A minimized background monitor has been launched to open the browser once ready.

:: Launch the minimized browser monitor for port 3000 using a clean, safe PowerShell command
start "BODHIQ Browser Monitor" /min powershell -Command "while ($true) { try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 >$null; start 'http://localhost:3000'; break } catch { Start-Sleep -Seconds 3 } }"

:: Start Backend in a new window
start "BODHIQ Backend" cmd /k "cd backend && if not exist venv (echo Creating Python virtual environment... && python -m venv venv && call venv\Scripts\activate && echo Installing backend requirements... && pip install -r requirements.txt) else (call venv\Scripts\activate) && echo Starting FastAPI server... && python -m uvicorn app.main:app --reload --port 8000"

:: Start Frontend in the foreground of this window so they see the npm install / compilation logs
cd frontend
if not exist node_modules (
    echo [INFO] Installing frontend npm packages...
    npm install
)
echo [INFO] Starting Next.js dev server...
npm run dev

:end
echo.
echo ====================================================================
echo [INFO] Runner script ended.
echo ====================================================================
echo.
pause
