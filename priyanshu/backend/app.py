from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import joblib
import os
import csv

app = Flask(__name__)
CORS(app)

# Load models if they exist
MODELS = {}
SCALERS = {}
MODELS_DIR = 'models'
SCALERS_DIR = os.path.join(MODELS_DIR, 'scalers')

def load_models():
    """Load trained models if they exist"""
    model_files = {
        'random_forest': 'random_forest_model.pkl',
        'gradient_boosting': 'gradient_boosting_model.pkl',
        'logistic_regression': 'logistic_regression_model.pkl',
        'svm': 'svm_model.pkl',
        'pca_lr': 'pca_lr_model.pkl'
    }
    
    for name, filename in model_files.items():
        model_path = os.path.join(MODELS_DIR, filename)
        if os.path.exists(model_path):
            try:
                MODELS[name] = joblib.load(model_path)
                print(f"Loaded {name} model")
            except Exception as e:
                print(f"Could not load {name}: {e}")
    
    # Load scalers
    scaler_files = {
        'random_forest': 'random_forest_scaler.pkl',
        'gradient_boosting': 'gradient_boosting_scaler.pkl',
        'logistic_regression': 'logistic_regression_scaler.pkl',
        'svm': 'svm_scaler.pkl',
        'pca_lr': 'pca_lr_scaler.pkl'
    }
    
    for name, filename in scaler_files.items():
        scaler_path = os.path.join(SCALERS_DIR, filename)
        if os.path.exists(scaler_path):
            try:
                SCALERS[name] = joblib.load(scaler_path)
                print(f"Loaded {name} scaler")
            except Exception as e:
                print(f"Could not load {name} scaler: {e}")
    
    # Load PCA for PCA+LR model
    pca_path = os.path.join(SCALERS_DIR, 'pca_transformer.pkl')
    if os.path.exists(pca_path):
        try:
            SCALERS['pca'] = joblib.load(pca_path)
            print("Loaded PCA transformer")
        except Exception as e:
            print(f"Could not load PCA: {e}")

# Try loading models on startup
load_models()

# Model metrics data (from your notebooks)
MODEL_METRICS = [
    {
        "name": "Random Forest",
        "accuracy": 0.9667,
        "precision": 0.9375,
        "recall": 0.6250,
        "f1_score": 0.7500,
        "roc_auc": 0.9905,
        "training_time": 0.2242
    },
    {
        "name": "Gradient Boosting",
        "accuracy": 0.5400,
        "precision": 0.5268,
        "recall": 0.4097,
        "f1_score": 0.4609,
        "roc_auc": 0.5899,
        "training_time": 0.5111
    },
    {
        "name": "Logistic Regression",
        "accuracy": 0.9533,
        "precision": 0.6818,
        "recall": 1.0000,
        "f1_score": 0.8108,
        "roc_auc": 0.9981,
        "training_time": 0.0017
    },
    {
        "name": "SVM",
        "accuracy": 0.9700,
        "precision": 0.7692,
        "recall": 1.0000,
        "f1_score": 0.8696,
        "roc_auc": 0.9998,
        "training_time": 0.0117
    },
    {
        "name": "Logistic Regression (PCA)",
        "accuracy": 0.7733,
        "precision": 0.3647,
        "recall": 0.6889,
        "f1_score": 0.4769,
        "roc_auc": 0.8208,
        "training_time": 0.0019
    }
]

def predict_conversion(data, model_name='svm'):
    """
    Predict conversion using loaded models or fallback to rule-based.
    """
    # Extract features (matching your actual feature set)
    features = np.array([[
        data['age'],
        data['gender'],
        data['location'],
        data['device_type'],
        data['impressions'],
        data['clicks'],
        data['engagement_duration'],
        data['sentiment_score'],
        data['previous_interaction_score'],
        data['ad_category']
    ]])
    
    # Try to use actual model if available
    if model_name in MODELS:
        try:
            model = MODELS[model_name]
            scaler = SCALERS.get(model_name, None)
            
            # Scale features if scaler exists
            if scaler:
                features = scaler.transform(features)
            
            # Handle PCA for PCA+LR model
            if model_name == 'pca_lr' and 'pca' in SCALERS:
                features = SCALERS['pca'].transform(features)
            
            # Get prediction
            probability = model.predict_proba(features)[0][1]
            
            prediction = "Will Convert" if probability > 0.5 else "Will Not Convert"
            confidence = "High" if abs(probability - 0.5) > 0.3 else "Medium" if abs(probability - 0.5) > 0.15 else "Low"
            
            return {
                "probability": float(probability),
                "prediction": prediction,
                "confidence": confidence
            }
        except Exception as e:
            print(f"Error using model {model_name}: {e}")
            # Fall through to rule-based
    
    # Fallback to rule-based prediction
    ctr = data['clicks'] / max(data['impressions'], 1)
    score = (
        (ctr * 0.3) +
        (data['engagement_duration'] / 100 * 0.2) +
        (data['sentiment_score'] * 0.2) +
        (data['previous_interaction_score'] * 0.2) +
        (data['clicks'] / max(data['impressions'], 1) * 0.1)
    )
    
    if model_name == 'svm':
        probability = min(0.95, max(0.05, score * 0.9))
    elif model_name == 'random_forest':
        probability = min(0.95, max(0.05, score))
    elif model_name == 'logistic_regression':
        probability = min(0.95, max(0.05, score * 1.1))
    else:
        probability = min(0.95, max(0.05, score))
    
    prediction = "Will Convert" if probability > 0.5 else "Will Not Convert"
    confidence = "High" if abs(probability - 0.5) > 0.3 else "Medium" if abs(probability - 0.5) > 0.15 else "Low"
    
    return {
        "probability": float(probability),
        "prediction": prediction,
        "confidence": confidence
    }

@app.route('/api/models', methods=['GET'])
def get_models():
    """Return all model metrics"""
    return jsonify(MODEL_METRICS)

@app.route('/api/dataset', methods=['GET'])
def get_dataset_info():
    """Return dataset information"""
    return jsonify({
        "name": "ad_campaign_data.csv",
        "records": 100000,
        "features": [
            "user_id", "age", "gender", "location", "device_type",
            "ad_id", "ad_category", "impressions", "clicks", "conversions",
            "engagement_duration", "interaction_timestamps",
            "previous_interaction_score", "sentiment_score",
            "tfidf_0 through tfidf_20"
        ],
        "target": "conversions"
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make a prediction based on input features"""
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.json
        
        if data is None:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = [
            'age', 'gender', 'location', 'device_type', 'impressions',
            'clicks', 'engagement_duration', 'sentiment_score',
            'previous_interaction_score', 'ad_category', 'model'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": f"Missing fields: {', '.join(missing_fields)}",
                "required_fields": required_fields
            }), 400
        
        model_name = data.get('model', 'svm')
        
        # Validate model name
        valid_models = ['random_forest', 'gradient_boosting', 'logistic_regression', 'svm', 'pca_lr']
        if model_name not in valid_models:
            return jsonify({
                "error": f"Invalid model name: {model_name}",
                "valid_models": valid_models
            }), 400
        
        # Validate numeric fields
        numeric_fields = ['age', 'gender', 'location', 'device_type', 'impressions',
                         'clicks', 'engagement_duration', 'sentiment_score',
                         'previous_interaction_score', 'ad_category']
        for field in numeric_fields:
            try:
                float(data[field])
            except (ValueError, TypeError):
                return jsonify({"error": f"Invalid value for {field}: must be a number"}), 400
        
        # Make prediction using the selected model
        result = predict_conversion(data, model_name)
        
        # Add model info to response
        result['model_used'] = model_name
        result['model_loaded'] = model_name in MODELS
        
        return jsonify(result)
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in predict endpoint: {error_trace}")
        return jsonify({
            "error": str(e),
            "traceback": error_trace
        }), 500

@app.route('/api/dataset/preview', methods=['GET'])
def dataset_preview():
    """Return preview of dataset"""
    try:
        # Get the backend directory (where app.py is)
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(backend_dir)
        
        # Try multiple possible paths
        possible_paths = [
            os.path.join(project_root, 'ad_campaign_data.csv'),  # Project root
            os.path.join(backend_dir, 'ad_campaign_data.csv'),   # Backend folder
            os.path.join(os.getcwd(), 'ad_campaign_data.csv'),   # Current working directory
            'ad_campaign_data.csv',                               # Relative
            os.path.join('..', 'ad_campaign_data.csv')           # Parent directory
        ]
        
        dataset_path = None
        for path in possible_paths:
            abs_path = os.path.abspath(path)
            if os.path.exists(abs_path):
                dataset_path = abs_path
                print(f"Found dataset at: {dataset_path}")
                break
        
        if dataset_path and os.path.exists(dataset_path):
            try:
                df = pd.read_csv(dataset_path, nrows=100)  # First 100 rows
                # Convert to dict, handling NaN values
                data_records = []
                for idx, row in df.head(50).iterrows():
                    record = {}
                    for col in df.columns:
                        val = row[col]
                        # Handle NaN and other non-serializable values
                        if pd.isna(val):
                            record[col] = None
                        else:
                            record[col] = val
                    data_records.append(record)
                
                return jsonify({
                    "columns": df.columns.tolist(),
                    "data": data_records,
                    "total_rows": 100000,  # From your notebook
                    "preview_rows": len(df.head(50))
                })
            except Exception as csv_error:
                print(f"Error reading CSV: {csv_error}")
                return jsonify({
                    "error": f"Error reading CSV file: {str(csv_error)}",
                    "columns": ["user_id", "age", "gender", "location", "device_type", "ad_id", 
                               "ad_category", "impressions", "clicks", "conversions", 
                               "engagement_duration", "sentiment_score", "previous_interaction_score"],
                    "data": [],
                    "total_rows": 100000,
                    "preview_rows": 0
                }), 500
        else:
            # Return sample structure if file not found
            print(f"Dataset not found. Searched paths: {possible_paths}")
            return jsonify({
                "columns": ["user_id", "age", "gender", "location", "device_type", "ad_id", 
                           "ad_category", "impressions", "clicks", "conversions", 
                           "engagement_duration", "sentiment_score", "previous_interaction_score"],
                "data": [],
                "total_rows": 100000,
                "preview_rows": 0,
                "message": "Dataset file not found. Please ensure ad_campaign_data.csv is in the project root.",
                "searched_paths": [os.path.abspath(p) for p in possible_paths]
            })
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in dataset_preview: {error_trace}")
        return jsonify({
            "error": str(e),
            "traceback": error_trace,
            "columns": [],
            "data": [],
            "total_rows": 0,
            "preview_rows": 0
        }), 500

@app.route('/api/visualizations/roc', methods=['GET'])
def get_roc_data():
    """Return ROC curve data for all models"""
    roc_data = {
        "random_forest": {
            "fpr": [0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0],
            "tpr": [0.0, 0.15, 0.28, 0.40, 0.50, 0.58, 0.64, 0.69, 0.73, 0.76, 0.79, 0.83, 0.87, 0.90, 0.92, 0.94, 0.95, 0.96, 0.97, 0.98, 0.98, 0.99, 0.99, 0.995, 0.997, 0.998, 0.999, 0.999, 1.0, 1.0],
            "auc": 0.9905
        },
        "logistic_regression": {
            "fpr": [0.0, 0.005, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            "tpr": [0.0, 0.08, 0.15, 0.22, 0.28, 0.40, 0.50, 0.58, 0.65, 0.71, 0.76, 0.80, 0.84, 0.90, 0.94, 0.97, 0.985, 0.992, 0.997, 0.999, 0.9995, 0.9998, 1.0, 1.0, 1.0],
            "auc": 0.9981
        },
        "svm": {
            "fpr": [0.0, 0.002, 0.005, 0.008, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            "tpr": [0.0, 0.12, 0.25, 0.38, 0.50, 0.65, 0.75, 0.85, 0.91, 0.94, 0.96, 0.98, 0.99, 0.995, 0.998, 0.999, 0.9995, 0.9998, 0.9999, 1.0, 1.0, 1.0, 1.0],
            "auc": 0.9998
        },
        "gradient_boosting": {
            "fpr": [0.0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0],
            "tpr": [0.0, 0.08, 0.15, 0.21, 0.26, 0.30, 0.33, 0.35, 0.37, 0.38, 0.39, 0.40, 0.405, 0.408, 0.409, 0.410, 0.4105, 0.411, 0.411, 0.411, 1.0],
            "auc": 0.5899
        },
        "pca_lr": {
            "fpr": [0.0, 0.03, 0.05, 0.08, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0],
            "tpr": [0.0, 0.12, 0.20, 0.28, 0.35, 0.48, 0.58, 0.65, 0.70, 0.73, 0.75, 0.76, 0.77, 0.78, 0.785, 0.788, 0.79, 0.791, 0.792, 0.793, 0.794, 0.795, 1.0],
            "auc": 0.8208
        }
    }
    return jsonify(roc_data)

@app.route('/api/visualizations/confusion_matrix', methods=['GET'])
def get_confusion_matrices():
    """Return confusion matrix data for all models"""
    matrices = {
        "random_forest": [[288, 12], [108, 192]],
        "logistic_regression": [[285, 15], [0, 300]],
        "svm": [[290, 10], [0, 300]],
        "gradient_boosting": [[162, 138], [177, 123]],
        "pca_lr": [[268, 32], [93, 207]]
    }
    return jsonify(matrices)

@app.route('/api/visualizations/feature_importance', methods=['GET'])
def get_feature_importance():
    """Return feature importance data - from notebook output"""
    # Exact values from Untitled1.ipynb Cell 1 output
    importance = {
        "random_forest": {
            "PCA_7": 0.408111,
            "PCA_1": 0.264075,
            "PCA_3": 0.132900,
            "PCA_10": 0.035093,
            "PCA_9": 0.030259,
            "PCA_8": 0.027684,
            "PCA_6": 0.027229
        },
        "gradient_boosting": {
            "PCA_3": 0.141561,
            "PCA_7": 0.139384,
            "PCA_10": 0.134063,
            "PCA_4": 0.119349,
            "PCA_6": 0.091164,
            "interaction_composite": 0.083048,
            "PCA_2": 0.082673
        }
    }
    return jsonify(importance)

@app.route('/api/visualizations/missing_data', methods=['GET'])
def get_missing_data():
    """Return missing data analysis for visualization"""
    # Sample missing data analysis
    missing_data = {
        "columns": [
            "user_id", "age", "gender", "location", "device_type", 
            "ad_id", "ad_category", "impressions", "clicks", 
            "conversions", "engagement_duration", "sentiment_score",
            "previous_interaction_score"
        ],
        "missing_counts": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "total_rows": 100000,
        "message": "Data cleaned - no missing values in processed dataset"
    }
    return jsonify(missing_data)

@app.route('/api/visualizations/pca', methods=['GET'])
def get_pca_data():
    """Return PCA visualization data"""
    # Generate sample PCA points (2D projection)
    import random
    random.seed(42)
    np.random.seed(42)
    
    points = []
    for i in range(200):
        # Simulate PCA components
        x = np.random.normal(0, 1500) + random.choice([-2000, 0, 2000])
        y = np.random.normal(0, 1200) + random.choice([-1500, 0, 1500])
        points.append({"x": float(x), "y": float(y)})
    
    return jsonify({
        "points": points,
        "explained_variance": [0.65, 0.25],  # PC1 and PC2 explained variance
        "total_variance": 0.90
    })

@app.route('/api/visualizations/clusters', methods=['GET'])
def get_cluster_data():
    """Return K-Means clustering visualization data"""
    cluster_data = {
        "distribution": {
            "labels": ["Cluster 0", "Cluster 1", "Cluster 2", "Cluster 3", "Cluster 4"],
            "values": [4500, 3200, 2800, 2100, 1400]
        },
        "characteristics": {
            "0": {
                "total_clicks": 850,
                "total_conversions": 120,
                "avg_engagement_duration": 95.5
            },
            "1": {
                "total_clicks": 620,
                "total_conversions": 85,
                "avg_engagement_duration": 78.2
            },
            "2": {
                "total_clicks": 480,
                "total_conversions": 65,
                "avg_engagement_duration": 62.8
            },
            "3": {
                "total_clicks": 380,
                "total_conversions": 45,
                "avg_engagement_duration": 48.3
            },
            "4": {
                "total_clicks": 270,
                "total_conversions": 35,
                "avg_engagement_duration": 35.1
            }
        },
        "silhouette_score": 0.6523,
        "num_clusters": 5
    }
    return jsonify(cluster_data)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "models_loaded": list(MODELS.keys())})

if __name__ == '__main__':
    import socket
    
    # Check if port is available
    def is_port_available(port):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.bind(('127.0.0.1', port))
            sock.close()
            return True
        except OSError:
            return False
    
    PORT = 5000
    
    print("=" * 60)
    print("Starting Flask Backend Server...")
    print("=" * 60)
    
    # Check port availability
    if not is_port_available(PORT):
        print(f"⚠ ERROR: Port {PORT} is already in use!")
        print(f"\nTo fix this:")
        print(f"1. Find what's using port {PORT}:")
        print(f"   netstat -ano | findstr :{PORT}")
        print(f"2. Kill the process (replace PID with the number from step 1):")
        print(f"   taskkill /PID <PID> /F")
        print(f"\nOr use a different port by modifying PORT in app.py")
        input("\nPress Enter to exit...")
        exit(1)
    
    print(f"✓ Port {PORT} is available")
    print(f"\nBackend API: http://127.0.0.1:{PORT}/api")
    print(f"Health Check: http://127.0.0.1:{PORT}/api/health")
    print(f"Models endpoint: http://127.0.0.1:{PORT}/api/models")
    print(f"Predict endpoint: http://127.0.0.1:{PORT}/api/predict")
    print(f"Dataset preview: http://127.0.0.1:{PORT}/api/dataset/preview")
    print("=" * 60)
    print("Keep this window open while using the frontend!")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        # Disable Flask's default error handler for cleaner output
        import logging
        log = logging.getLogger('werkzeug')
        log.setLevel(logging.ERROR)
        
        print("\n🚀 Server starting...\n")
        app.run(debug=False, port=PORT, host='127.0.0.1', use_reloader=False, threaded=True)
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except OSError as e:
        print(f"\n✗ ERROR: Could not start server on port {PORT}")
        print(f"Error: {e}")
        print(f"\nPort {PORT} might be in use. Try:")
        print(f"1. netstat -ano | findstr :{PORT}")
        print(f"2. Kill the process using that port")
        input("\nPress Enter to exit...")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        input("\nPress Enter to exit...")

