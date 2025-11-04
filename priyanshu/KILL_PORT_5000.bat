@echo off
echo ============================================
echo   KILLING PROCESS ON PORT 5000
echo ============================================
echo.

echo Finding process on port 5000...
netstat -ano | findstr :5000

echo.
echo Killing process...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing PID: %%a
    taskkill /PID %%a /F
)

echo.
echo Done! Now try starting backend again.
pause

