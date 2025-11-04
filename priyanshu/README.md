# Ad Campaign ML - Frontend Project

Simple frontend to display ML model comparisons and make predictions.

## 🚀 Quick Start

### 1. Start Backend (Flask API)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend will run on `http://localhost:5000`

### 2. Start Frontend

Just open `frontend/index.html` in your browser, or use a simple HTTP server:

```bash
cd frontend
# Python 3
python -m http.server 8000

# Or use any simple server
# Then open http://localhost:8000
```

## 📁 Project Structure

```
.
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # All styling
│   └── app.js          # All JavaScript logic
├── backend/
│   ├── app.py          # Flask API server
│   └── requirements.txt # Python dependencies
└── README.md
```

## ✨ Features

- **Home Page**: Project overview and dataset info
- **Models Page**: Comparison table and charts
- **Predict Page**: Interactive prediction form

## 🎯 API Endpoints

- `GET /api/models` - Get all model metrics
- `GET /api/dataset` - Get dataset info
- `POST /api/predict` - Make predictions
- `GET /api/health` - Health check

## 📝 Notes

- Frontend works even if backend is down (uses fallback data)
- Prediction uses simplified rule-based logic (replace with actual models in production)
- All code is in 3 simple files (HTML, CSS, JS)

## 🔧 Customization

To use actual trained models:
1. Save your models using `joblib.dump()` in your notebooks
2. Load them in `backend/app.py` using `joblib.load()`
3. Call `model.predict()` instead of the simple rule-based function

