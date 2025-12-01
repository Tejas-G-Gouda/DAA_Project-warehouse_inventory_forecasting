@echo off
REM =====================================================
REM InvenForecast - Quick Start Server
REM =====================================================
REM This script starts a local web server for development

cls
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║  InvenForecast - AI Inventory Forecasting System  ║
echo ║              Local Development Server             ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Python found - Starting server...
    echo.
    echo ═══════════════════════════════════════════════════════
    echo   Server is running at: http://localhost:8000
    echo.
    echo   Press Ctrl+C to stop the server
    echo ═══════════════════════════════════════════════════════
    echo.
    python -m http.server 8000
) else (
    echo [✗] Python not found on this system
    echo.
    echo Please install Python from https://www.python.org/
    echo.
    echo Alternatively, you can use Node.js:
    echo   1. Install http-server: npm install -g http-server
    echo   2. Run: http-server -p 8000
    echo.
    pause
)
