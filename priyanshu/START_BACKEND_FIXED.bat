@echo off
echo ============================================
echo   STARTING BACKEND SERVER (FIXED)
echo ============================================
echo.

cd backend

echo Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python or add it to PATH
    pause
    exit /b 1
)

echo.
echo Checking dependencies...
python -c "import flask; import flask_cors; import numpy; import pandas; import sklearn; import joblib; print('All dependencies OK')" 2>nul
if errorlevel 1 (
    echo.
    echo Installing missing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting backend server...
python app.py

pause

