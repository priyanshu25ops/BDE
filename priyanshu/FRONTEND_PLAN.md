# Frontend Development Plan for Ad Campaign ML Project

## Project Overview
This frontend will display your ML model comparison results, dataset information, and provide an interactive prediction interface for ad campaign conversion.

---

## 📋 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── assets/          # Images, icons
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── DatasetInfo.jsx
│   │   ├── ProjectBrief.jsx
│   │   ├── ModelComparison.jsx
│   │   ├── ModelVisualizations.jsx
│   │   ├── PredictionInterface.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Models.jsx
│   │   └── Predict.jsx
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── backend/
│   ├── app.py            # Flask/FastAPI backend
│   ├── models/           # Saved ML models
│   ├── utils/
│   │   └── model_loader.py
│   └── requirements.txt
├── package.json
└── README.md
```

---

## 🎯 Features to Implement

### 1. **Home Page** (`/`)
- **Project Title**: "Ad Campaign Conversion Prediction - ML Model Comparison"
- **Brief Description**: 
  - Overview of the project (ad campaign data analysis)
  - Dataset information (100,000 records, features like age, gender, location, device type, impressions, clicks, engagement duration, etc.)
  - Technologies used (PySpark, scikit-learn, pandas, matplotlib)
- **Quick Stats Cards**: 
  - Total records: 100,000
  - Models compared: 5
  - Best model: SVM (Accuracy: 97%)
  - Dataset size info

### 2. **Model Comparison Page** (`/models`)
- **Model Comparison Table**: Side-by-side metrics
  - Random Forest
  - Gradient Boosting
  - Logistic Regression
  - SVM (Support Vector Machine)
  - Logistic Regression with PCA

- **Visualizations**:
  - **Accuracy Bar Chart**: Comparison of all models
  - **F1 Score vs ROC AUC Scatter Plot**: Performance overview
  - **Precision, Recall, F1 Grouped Bar Chart**: Detailed metrics
  - **ROC Curves**: For each model (overlaid or separate)
  - **Confusion Matrices**: For each model (heatmaps)
  - **Feature Importance Charts**: For tree-based models
  - **Training Time Comparison**: Performance vs efficiency

- **Interactive Features**:
  - Filter/sort models by metric
  - Toggle between different visualizations
  - Download charts as images

### 3. **Interactive Prediction Page** (`/predict`)
- **User Input Form**:
  - Age (slider/number input)
  - Gender (dropdown: 0/1)
  - Location (dropdown: 0/1/2)
  - Device Type (dropdown: Mobile/Desktop/Tablet)
  - Impressions (number input)
  - Clicks (number input)
  - Engagement Duration (number input, seconds)
  - Sentiment Score (slider: 0-1)
  - Previous Interaction Score (slider: 0-1)
  - Ad Category (dropdown: 1/2/3)

- **Model Selection**: Dropdown to choose which model to use for prediction

- **Prediction Results**:
  - Conversion Probability (0-100%)
  - Predicted Class (Yes/No Conversion)
  - Confidence Level
  - Visual indicator (green/red)

- **Additional Features**:
  - Example inputs (pre-filled buttons)
  - Clear form
  - Save prediction history (localStorage)

---

## 🛠️ Technology Stack

### Frontend:
- **React** (or HTML/CSS/JS if simpler preferred)
- **Chart.js** / **Recharts** / **Plotly.js** for visualizations
- **Bootstrap** / **Tailwind CSS** for styling
- **React Router** for navigation

### Backend:
- **Flask** or **FastAPI** (Python)
- **Joblib** or **Pickle** to load saved models
- **scikit-learn** for predictions
- **Flask-CORS** for API access

---

## 📊 Data to Extract from Notebooks

### Model Performance Metrics:
```json
{
  "Random Forest": {
    "Accuracy": 0.9667,
    "Precision": 0.9375,
    "Recall": 0.6250,
    "F1 Score": 0.7500,
    "ROC AUC": 0.9905,
    "Training Time": 0.2242
  },
  "Gradient Boosting": {
    "Accuracy": 0.5400,
    "Precision": 0.5268,
    "Recall": 0.4097,
    "F1 Score": 0.4609,
    "ROC AUC": 0.5899,
    "Training Time": 0.5111
  },
  "Logistic Regression": {
    "Accuracy": 0.9533,
    "Precision": 0.6818,
    "Recall": 1.0000,
    "F1 Score": 0.8108,
    "ROC AUC": 0.9981,
    "Training Time": 0.0017
  },
  "SVM": {
    "Accuracy": 0.9700,
    "Precision": 0.7692,
    "Recall": 1.0000,
    "F1 Score": 0.8696,
    "ROC AUC": 0.9998,
    "Training Time": 0.0117
  },
  "Logistic Regression (PCA)": {
    "Accuracy": 0.7733,
    "Precision": 0.3647,
    "Recall": 0.6889,
    "F1 Score": 0.4769,
    "ROC AUC": 0.8208,
    "Training Time": 0.0019
  }
}
```

### Dataset Information:
- **File**: `ad_campaign_data.csv`
- **Records**: 100,000
- **Features**: 
  - user_id, age, gender, location, device_type
  - ad_id, ad_category, impressions, clicks
  - conversions (target variable)
  - engagement_duration, interaction_timestamps
  - previous_interaction_score, sentiment_score
  - tfidf_0 through tfidf_20 (21 TF-IDF features)

---

## 🎨 UI/UX Design Ideas

### Color Scheme:
- Primary: Blue (#1f77b4) - Data/analytics theme
- Success: Green (#2ca02c) - Positive predictions
- Warning: Orange (#ff7f0e) - Medium confidence
- Danger: Red (#d62728) - Negative predictions
- Background: Light gray (#f8f9fa)

### Layout:
- **Header**: Navigation bar with logo and menu
- **Sidebar** (optional): Quick navigation
- **Main Content**: Responsive grid layout
- **Footer**: Project info, links

---

## 🔄 Implementation Steps

1. **Phase 1**: Setup project structure
   - Initialize React app
   - Setup backend API
   - Create folder structure

2. **Phase 2**: Backend API
   - Load saved models
   - Create prediction endpoint
   - Create metrics/data endpoints

3. **Phase 3**: Frontend Components
   - Home page with project info
   - Model comparison page
   - Prediction interface

4. **Phase 4**: Visualizations
   - Integrate charts from notebooks
   - Make them interactive
   - Add export functionality

5. **Phase 5**: Polish & Testing
   - Responsive design
   - Error handling
   - Loading states
   - User feedback

---

## 📝 Additional Notes

- **Model Saving**: Ensure models are saved (joblib/pickle) during notebook execution
- **API Endpoints**:
  - `GET /api/models` - Get all model metrics
  - `GET /api/dataset` - Get dataset info
  - `POST /api/predict` - Make predictions
  - `GET /api/visualizations` - Get chart data

- **Deployment**: 
  - Frontend: Netlify/Vercel
  - Backend: Heroku/Render/AWS

---

## 🚀 Next Steps

1. Choose frontend framework (React recommended)
2. Setup backend API
3. Extract and save model metrics as JSON
4. Create visualization data files
5. Build components one by one
6. Test and deploy

---

**Ready to start implementation?** Let me know if you'd like to proceed with React + Flask setup, or if you prefer a simpler HTML/CSS/JS approach!

