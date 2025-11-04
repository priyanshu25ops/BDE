# How to Save Your Trained Models

To use your actual trained models in the frontend, follow these steps:

## 1. In Your Notebooks

After training each model, save it using joblib:

```python
import joblib
import os

# Create directories
os.makedirs('backend/models', exist_ok=True)
os.makedirs('backend/models/scalers', exist_ok=True)

# Save Random Forest model
joblib.dump(rf_model, 'backend/models/random_forest_model.pkl')
joblib.dump(scaler, 'backend/models/scalers/random_forest_scaler.pkl')

# Save Gradient Boosting model
joblib.dump(gb_model, 'backend/models/gradient_boosting_model.pkl')
joblib.dump(scaler, 'backend/models/scalers/gradient_boosting_scaler.pkl')

# Save Logistic Regression model
joblib.dump(lr_model, 'backend/models/logistic_regression_model.pkl')
joblib.dump(scaler, 'backend/models/scalers/logistic_regression_scaler.pkl')

# Save SVM model
joblib.dump(svm_model, 'backend/models/svm_model.pkl')
joblib.dump(scaler, 'backend/models/scalers/svm_scaler.pkl')

# Save PCA + Logistic Regression model
joblib.dump(pca_lr_model, 'backend/models/pca_lr_model.pkl')
joblib.dump(pca, 'backend/models/scalers/pca_transformer.pkl')
joblib.dump(scaler, 'backend/models/scalers/pca_lr_scaler.pkl')
```

## 2. Model Structure

Your models should accept features in this order:
- age
- gender
- location
- device_type
- impressions
- clicks
- engagement_duration
- sentiment_score
- previous_interaction_score
- ad_category

## 3. Test Models

After saving, restart the Flask server and check the health endpoint:
```bash
curl http://localhost:5000/api/health
```

It will show which models are loaded.

## 4. Alternative: Use Sample Models

If you want to test without your actual models, run:
```bash
cd backend
python save_models.py
```

This creates sample models for testing.

