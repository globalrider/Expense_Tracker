@echo off
echo ===================================================
echo Starting Expense Tracker Spring Boot Backend
echo Database: MySQL (jdbc:mysql://localhost:3306/expensedb)
echo ===================================================

cd /d "%~dp0"

set "MVN_CMD=mvn"
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.2\plugins\maven-plugin\lib\maven3\bin\mvn.cmd" (
        set "MVN_CMD=C:\Program Files\JetBrains\IntelliJ IDEA 2026.2\plugins\maven-plugin\lib\maven3\bin\mvn.cmd"
    )
)

where %MVN_CMD% >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Maven: %MVN_CMD%
    call "%MVN_CMD%" spring-boot:run
) else (
    echo Maven is not found in PATH.
    echo Please install Apache Maven or open this project in IntelliJ IDEA / Eclipse / VS Code.
    echo In IntelliJ IDEA: File -^> Open -^> Select the 'backend' folder -^> Click Run.
    pause
)
