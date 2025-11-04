@echo off
REM ============================================
REM   BACKEND SERVER - AUTOMATIC FIX & START
REM ============================================

title Backend Server
color 0B

echo.
echo ============================================
echo   BACKEND SERVER - PORT 5000
echo ============================================
echo.

REM Change to project root
cd /d %~dp0

REM Find Python
echo [1/4] Finding Python...
where python >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON=python
    echo    Using: python
    goto :found_python
)

where py >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON=py
    echo    Using: py
    goto :found_python
)

echo    ERROR: Python not found!
echo    Please install Python from python.org
echo    Make sure to check "Add Python to PATH"
pause
exit /b 1

:found_python

REM Check/Kill port 5000
echo.
echo [2/4] Checking port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING 2^>nul') do (
    echo    Port 5000 is in use by PID %%a
    echo    Killing process...
    taskkill /PID %%a /F >nul 2>&1
    timeout /t 1 >nul
    echo    Process killed
)

REM Install dependencies
echo.
echo [3/4] Checking dependencies...
cd backend
%PYTHON% -c "import flask; import flask_cors" >nul 2>&1
if errorlevel 1 (
    echo    Installing dependencies...
    %PYTHON% -m pip install -r requirements.txt --quiet
    if errorlevel 1 (
        echo    ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo    Dependencies installed
) else (
    echo    Dependencies OK
)

REM Start server
echo.
echo [4/4] Starting server...
echo.
echo ============================================
echo   SERVER RUNNING ON http://127.0.0.1:5000
echo   Keep this window open!
echo ============================================
echo.
echo   Health Check: http://127.0.0.1:5000/api/health
echo   API Base: http://127.0.0.1:5000/api
echo.
echo   Press Ctrl+C to stop
echo ============================================
echo.

REM Use start.py which handles paths correctly
%PYTHON% start.py

if errorlevel 1 (
    echo.
    echo ERROR: Server failed to start
    echo Check the error message above
    pause
)

