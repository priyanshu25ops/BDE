# Quick Start Guide

## Start Backend Server

**Option 1: Double-click `start_backend.bat`**

**Option 2: Manual start**
```bash
cd backend
python app.py
```

You should see:
```
============================================================
Starting Flask Backend Server...
============================================================
Backend API: http://localhost:5000/api
...
```

## Start Frontend

**Option 1: Open directly**
- Double-click `frontend/index.html`

**Option 2: Use Python server**
```bash
cd frontend
python -m http.server 8000
```
Then open: http://localhost:8000

## Verify Backend is Running

Open in browser: http://localhost:5000/api/health

Should return: `{"status": "healthy", "models_loaded": []}`

## Troubleshooting

1. **Backend won't start?**
   - Check if port 5000 is already in use
   - Install dependencies: `pip install -r backend/requirements.txt`

2. **Dataset preview not working?**
   - Make sure `ad_campaign_data.csv` is in the project root folder
   - Backend must be running

3. **Visualizations not showing?**
   - Refresh page (F5)
   - Check browser console (F12) for errors
   - Backend should be running for best results

