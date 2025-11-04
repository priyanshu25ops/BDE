# 🔥 BACKEND PORT 5000 - FIXED!

## ✅ QUICK START (EASIEST WAY)

**Just double-click**: `RUN_BACKEND.bat`

This will:
1. ✅ Find Python automatically
2. ✅ Kill any process on port 5000
3. ✅ Install missing dependencies
4. ✅ Start the backend server

## 🚨 If RUN_BACKEND.bat Doesn't Work

### Step 1: Kill Port 5000
Double-click: `KILL_PORT_5000.bat`

OR manually:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Step 2: Start Backend
Double-click: `START_BACKEND_SIMPLE.bat`

OR manually:
```bash
cd backend
python app.py
```

## 📋 What Was Fixed

1. **Port Check**: Backend now checks if port 5000 is available before starting
2. **Better Error Messages**: Clear messages about what's wrong
3. **Automatic Port Kill**: `RUN_BACKEND.bat` kills port 5000 automatically
4. **Python Detection**: Scripts find Python automatically (`python` or `py`)
5. **Dependency Check**: Automatically installs missing packages

## ✅ Verify It's Working

1. **Start backend**: Double-click `RUN_BACKEND.bat`
2. **You should see**:
   ```
   ============================================================
   Starting Flask Backend Server...
   ============================================================
   ✓ Port 5000 is available
   
   Backend API: http://127.0.0.1:5000/api
   ...
   🚀 Server starting...
   ```

3. **Test in browser**: Open http://127.0.0.1:5000/api/health
   - Should see: `{"status": "healthy", "models_loaded": []}`

4. **Test in frontend**: Open `frontend/index.html`
   - Dataset preview should work
   - Prediction should work

## 🐛 Still Having Issues?

### Python Not Found
- Install Python from python.org
- **IMPORTANT**: Check "Add Python to PATH" during installation
- Restart terminal after installation

### Port Still in Use
- Run `KILL_PORT_5000.bat` again
- Or restart your computer
- Or change port in `backend/app.py` (line 453): `PORT = 5001`

### Dependencies Missing
```bash
cd backend
pip install -r requirements.txt
```

### Connection Refused
- Make sure backend is running (check the window)
- Use `127.0.0.1:5000` not `localhost:5000`
- Check Windows Firewall

## 📁 Files Created

- `RUN_BACKEND.bat` ⭐ **USE THIS ONE** - Auto-fixes everything
- `START_BACKEND_SIMPLE.bat` - Simple startup
- `KILL_PORT_5000.bat` - Kill port 5000
- `FIX_BACKEND_NOW.md` - Detailed troubleshooting

## 🎯 Success Checklist

- [ ] Backend window shows "Server starting..."
- [ ] http://127.0.0.1:5000/api/health returns JSON
- [ ] Frontend can load dataset preview
- [ ] Frontend can make predictions
- [ ] No errors in browser console (F12)

---

**If nothing works, try restarting your computer and then run `RUN_BACKEND.bat`**

