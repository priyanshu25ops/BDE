"""Test script to verify backend is accessible"""
import requests
import sys

BASE_URL = "http://localhost:5000/api"

def test_endpoint(name, url, method='GET', data=None):
    """Test a single endpoint"""
    try:
        if method == 'GET':
            response = requests.get(url, timeout=5)
        else:
            response = requests.post(url, json=data, timeout=5)
        
        print(f"✓ {name}: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"  Response keys: {list(result.keys())[:5]}...")
            return True
        else:
            print(f"  Error: {response.text[:100]}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"✗ {name}: Connection refused - Backend not running!")
        return False
    except Exception as e:
        print(f"✗ {name}: {str(e)}")
        return False

print("=" * 60)
print("Testing Backend Connection")
print("=" * 60)

# Test health
test_endpoint("Health Check", f"{BASE_URL}/health")

# Test models
test_endpoint("Models", f"{BASE_URL}/models")

# Test dataset preview
test_endpoint("Dataset Preview", f"{BASE_URL}/dataset/preview")

# Test prediction
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
test_endpoint("Prediction", f"{BASE_URL}/predict", method='POST', data=test_data)

print("=" * 60)
print("Test Complete!")
print("=" * 60)

