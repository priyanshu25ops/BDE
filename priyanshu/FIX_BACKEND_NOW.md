# 🔥 BACKEND PORT 5000 FIX - STEP BY STEP

## QUICK FIX (Try This First!)

### Option 1: Kill Port 5000 and Restart
1. **Double-click**: `KILL_PORT_5000.bat` (kills any process on port 5000)
2. **Double-click**: `START_BACKEND_FIXED.bat` (starts backend)

### Option 2: Manual Fix
1. Open PowerShell or Command Prompt
2. Run: `netstat -ano | findstr :5000`
3. Find the PID (last number)
4. Run: `taskkill /PID <PID> /F` (replace <PID> with the number)
5. Start backend: `cd backend` then `python app.py`

## If Python Not Found

### Check Python Installation
```bash
# Try these commands:
python --version
python3 --version
py --version
```

### Install Python (if missing)
1. Download from: https://www.python.org/downloads/
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. Restart your terminal after installation

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

## Backend Startup Issues

### Test Backend Setup
```bash
cd backend
python check_setup.py
```

This will check:
- ✓ Python version
- ✓ All dependencies installed
- ✓ Port 5000 availability
- ✓ App can import

### Start Backend
```bash
cd backend
python app.py
```

You should see:
```
============================================================
Starting Flask Backend Server...
============================================================
✓ Port 5000 is available

Backend API: http://127.0.0.1:5000/api
Health Check: http://127.0.0.1:5000/api/health
...
```

## Common Errors

### Error: "Port 5000 is already in use"
**Fix**: Run `KILL_PORT_5000.bat` or manually kill the process

### Error: "Python was not found"
**Fix**: 
- Install Python and add to PATH
- Or use `py` instead of `python` (Windows)
- Or use full path to Python

### Error: "Module not found"
**Fix**: 
```bash
pip install flask flask-cors numpy pandas scikit-learn joblib
```

### Error: "Connection refused"
**Fix**: Backend is not running. Start it with `START_BACKEND_FIXED.bat`

## Verify Backend is Running

1. Open browser: http://127.0.0.1:5000/api/health
2. Should see: `{"status": "healthy", "models_loaded": []}`

## Still Not Working?

1. Check browser console (F12) for errors
2. Check backend console for error messages
3. Make sure you're using `127.0.0.1:5000` not `localhost:5000`
4. Try disabling firewall/antivirus temporarily

## Files Created

- `KILL_PORT_5000.bat` - Kills process on port 5000
- `START_BACKEND_FIXED.bat` - Starts backend with checks
- `backend/check_setup.py` - Tests backend setup
- `FIX_BACKEND_NOW.md` - This file

