"""
Script to save trained models from your notebooks.
Run this after training your models in the notebooks.
"""

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import os

# Create models directory
os.makedirs('models', exist_ok=True)
os.makedirs('models/scalers', exist_ok=True)

print("Creating example models...")
print("Note: Replace these with your actual trained models from notebooks")

# Sample data for training (replace with your actual data)
np.random.seed(42)
n_samples = 1000

# Create sample features matching your dataset
X_sample = np.random.rand(n_samples, 10)
y_sample = (np.random.rand(n_samples) > 0.9).astype(int)  # 90/10 imbalance

# StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_sample)

# 1. Random Forest
print("Training Random Forest...")
rf_model = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')
rf_model.fit(X_scaled, y_sample)
joblib.dump(rf_model, 'models/random_forest_model.pkl')
joblib.dump(scaler, 'models/scalers/random_forest_scaler.pkl')
print("✓ Random Forest saved")

# 2. Gradient Boosting
print("Training Gradient Boosting...")
gb_model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
gb_model.fit(X_scaled, y_sample)
joblib.dump(gb_model, 'models/gradient_boosting_model.pkl')
joblib.dump(scaler, 'models/scalers/gradient_boosting_scaler.pkl')
print("✓ Gradient Boosting saved")

# 3. Logistic Regression
print("Training Logistic Regression...")
lr_model = LogisticRegression(solver='liblinear', random_state=42, class_weight='balanced')
lr_model.fit(X_scaled, y_sample)
joblib.dump(lr_model, 'models/logistic_regression_model.pkl')
joblib.dump(scaler, 'models/scalers/logistic_regression_scaler.pkl')
print("✓ Logistic Regression saved")

# 4. SVM
print("Training SVM...")
svm_model = SVC(kernel='linear', random_state=42, probability=True, class_weight='balanced')
svm_model.fit(X_scaled, y_sample)
joblib.dump(svm_model, 'models/svm_model.pkl')
joblib.dump(scaler, 'models/scalers/svm_scaler.pkl')
print("✓ SVM saved")

# 5. PCA + Logistic Regression
print("Training PCA + Logistic Regression...")
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_scaled)
pca_lr_model = LogisticRegression(solver='liblinear', random_state=42, class_weight='balanced')
pca_lr_model.fit(X_pca, y_sample)
joblib.dump(pca_lr_model, 'models/pca_lr_model.pkl')
joblib.dump(pca, 'models/scalers/pca_transformer.pkl')
joblib.dump(scaler, 'models/scalers/pca_lr_scaler.pkl')
print("✓ PCA + Logistic Regression saved")

print("\n✅ All models saved!")
print("\nTo use your actual models:")
print("1. Train models in your notebooks")
print("2. Replace the model training code above with:")
print("   joblib.dump(your_model, 'models/your_model_name.pkl')")
print("   joblib.dump(your_scaler, 'models/scalers/your_scaler.pkl')")

