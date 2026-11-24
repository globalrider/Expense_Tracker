@echo off
title Expense Tracker - Frontend (Port 5173)
echo ===================================================
echo Starting Expense Tracker React Frontend (Port 5173)
echo ===================================================
cd /d "%~dp0frontend"
call npm run dev
pause
