"""Check if backend can start properly"""
import sys
import os

print("=" * 60)
print("Backend Setup Check")
print("=" * 60)

# Check Python version
print(f"Python version: {sys.version}")

# Check required packages
required_packages = [
    'flask',
    'flask_cors',
    'numpy',
    'pandas',
    'sklearn',
    'joblib'
]

missing = []
for package in required_packages:
    try:
        if package == 'sklearn':
            __import__('sklearn')
        elif package == 'flask_cors':
            __import__('flask_cors')
        else:
            __import__(package)
        print(f"✓ {package}")
    except ImportError:
        print(f"✗ {package} - MISSING")
        missing.append(package)

if missing:
    print("\n" + "=" * 60)
    print("MISSING PACKAGES! Install with:")
    print(f"pip install {' '.join(missing)}")
    print("=" * 60)
    sys.exit(1)

# Check if app.py can be imported
try:
    print("\nChecking app.py...")
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import app
    print("✓ app.py imports successfully")
except Exception as e:
    print(f"✗ app.py import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Check port 5000
import socket
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = sock.connect_ex(('127.0.0.1', 5000))
sock.close()

if result == 0:
    print("⚠ Port 5000 is already in use!")
    print("   Stop any process using port 5000 or change the port in app.py")
else:
    print("✓ Port 5000 is available")

print("\n" + "=" * 60)
print("Setup check complete!")
print("=" * 60)

