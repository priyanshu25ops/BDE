@echo off
title Backend Server - Port 5000
color 0A

echo ============================================
echo   BACKEND SERVER - PORT 5000
echo ============================================
echo.

cd /d %~dp0backend

echo [1/3] Checking Python...
where python >nul 2>&1
if errorlevel 1 (
    where py >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Python not found!
        echo Please install Python from python.org
        pause
        exit /b 1
    )
    set PYTHON_CMD=py
) else (
    set PYTHON_CMD=python
)

echo OK: Python found
echo.

echo [2/3] Checking dependencies...
%PYTHON_CMD% -c "import flask" 2>nul
if errorlevel 1 (
    echo Installing dependencies...
    %PYTHON_CMD% -m pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo OK: Dependencies found
)

echo.
echo [3/3] Starting backend server...
echo.
echo ============================================
echo   SERVER STARTING ON PORT 5000
echo   Keep this window open!
echo ============================================
echo.

%PYTHON_CMD% app.py

pause

