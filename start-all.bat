@echo off
title Expense Tracker - Launch All
echo ===================================================
echo Starting Expense Tracker (Frontend + Backend)
echo ===================================================

echo [1/2] Launching React Frontend on http://localhost:5173 ...
start "Expense Tracker - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo [2/2] Launching Spring Boot Backend on http://localhost:8080 ...
start "Expense Tracker - Backend" cmd /k "cd /d %~dp0backend && run.bat"

echo.
echo ===================================================
echo Services are starting in separate terminal windows!
echo - Frontend UI: http://localhost:5173
echo - Backend API: http://localhost:8080
echo ===================================================
echo.
echo Opening browser in 3 seconds...
timeout /t 3 >nul
start http://localhost:5173
