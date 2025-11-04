"""Quick test to verify backend is working"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

print("Testing Backend API...")
print("=" * 50)

# Test health
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"✓ Health Check: {response.status_code}")
    print(f"  Response: {response.json()}")
except Exception as e:
    print(f"✗ Health Check Failed: {e}")

# Test models
try:
    response = requests.get(f"{BASE_URL}/models")
    print(f"✓ Models Endpoint: {response.status_code}")
    data = response.json()
    print(f"  Found {len(data)} models")
except Exception as e:
    print(f"✗ Models Endpoint Failed: {e}")

# Test ROC data
try:
    response = requests.get(f"{BASE_URL}/visualizations/roc")
    print(f"✓ ROC Endpoint: {response.status_code}")
    data = response.json()
    print(f"  Found {len(data)} ROC curves")
except Exception as e:
    print(f"✗ ROC Endpoint Failed: {e}")

# Test prediction
try:
    test_data = {
        "age": 35,
        "gender": 0,
        "location": 1,
        "device_type": 2,
        "impressions": 1000,
        "clicks": 50,
        "engagement_duration": 60,
        "sentiment_score": 0.5,
        "previous_interaction_score": 0.5,
        "ad_category": 1,
        "model": "svm"
    }
    response = requests.post(f"{BASE_URL}/predict", json=test_data)
    print(f"✓ Predict Endpoint: {response.status_code}")
    result = response.json()
    print(f"  Prediction: {result.get('prediction')} ({result.get('probability', 0)*100:.2f}%)")
    print(f"  Model Used: {result.get('model_used', 'unknown')}")
except Exception as e:
    print(f"✗ Predict Endpoint Failed: {e}")

print("=" * 50)
print("Test Complete!")

