"""Safer backend startup script"""
import sys
import os
import socket

def check_port(port):
    """Check if port is available"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result != 0

def main():
    print("=" * 60)
    print("Starting Backend Server")
    print("=" * 60)
    
    # Check dependencies
    try:
        import flask
        import flask_cors
        import numpy
        import pandas
        from sklearn.ensemble import RandomForestClassifier
        import joblib
        print("✓ All dependencies found")
    except ImportError as e:
        print(f"✗ Missing dependency: {e}")
        print("\nInstall with: pip install -r requirements.txt")
        input("\nPress Enter to exit...")
        sys.exit(1)
    
    # Check port
    if not check_port(5000):
        print("⚠ Port 5000 is already in use!")
        print("   Please stop any process using port 5000")
        print("   Or kill it with: netstat -ano | findstr :5000")
        input("\nPress Enter to exit...")
        sys.exit(1)
    
    print("✓ Port 5000 is available")
    
    # Try to import and run app
    try:
        print("\nLoading Flask app...")
        # Change to backend directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Import app
        from app import app
        
        print("✓ Flask app loaded")
        print("\n" + "=" * 60)
        print("Starting server on http://127.0.0.1:5000")
        print("=" * 60)
        print("Keep this window open!")
        print("Press Ctrl+C to stop")
        print("=" * 60)
        
        # Run app
        app.run(debug=True, port=5000, host='127.0.0.1', use_reloader=False)
        
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        input("\nPress Enter to exit...")
        sys.exit(1)

if __name__ == '__main__':
    main()

