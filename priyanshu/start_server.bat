@echo off
echo Starting servers...
echo.

echo Starting Backend (Flask) on port 5000...
start "Backend Server" cmd /k "cd backend && python app.py"

timeout /t 3 >nul

echo Starting Frontend on port 8000...
start "Frontend Server" cmd /k "cd frontend && python -m http.server 8000"

timeout /t 2 >nul

echo Opening browser...
start http://localhost:8000

echo.
echo Servers are running!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8000
echo.
echo Press any key to exit (servers will keep running)...
pause >nul

