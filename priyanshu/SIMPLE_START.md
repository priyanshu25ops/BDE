# How to Open the Site

Since Python servers might not be working, here are simple ways to open the site:

## Option 1: Open HTML Directly (No Backend Needed for Viewing)

1. Navigate to the `frontend` folder
2. Double-click `index.html`
3. It will open in your browser

**Note:** The prediction feature won't work without the backend, but you can see all the visualizations using fallback data.

## Option 2: Use Python (if installed)

If you have Python installed, run these commands in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
python -m http.server 8000
```

Then open: http://localhost:8000

## Option 3: Use VS Code Live Server

If you have VS Code:
1. Install "Live Server" extension
2. Right-click `frontend/index.html`
3. Select "Open with Live Server"

## Option 4: Use Any Simple HTTP Server

**Node.js:**
```bash
cd frontend
npx http-server -p 8000
```

**PHP:**
```bash
cd frontend
php -S localhost:8000
```

---

**Quick Fix:** Just double-click `frontend/index.html` to see the site with all visualizations (using fallback data).

