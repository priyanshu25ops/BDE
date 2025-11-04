"""Direct backend startup - no path issues"""
import os
import sys

# Change to backend directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Import and run app
from app import app

if __name__ == '__main__':
    import socket
    
    PORT = 5000
    
    # Check port
    def is_port_available(port):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.bind(('127.0.0.1', port))
            sock.close()
            return True
        except OSError:
            return False
    
    if not is_port_available(PORT):
        print(f"ERROR: Port {PORT} is in use!")
        print("Run: netstat -ano | findstr :5000")
        sys.exit(1)
    
    print("=" * 60)
    print("Starting Backend Server on Port 5000")
    print("=" * 60)
    print(f"API: http://127.0.0.1:{PORT}/api")
    print("=" * 60)
    
    try:
        app.run(debug=False, port=PORT, host='127.0.0.1', use_reloader=False, threaded=True)
    except KeyboardInterrupt:
        print("\nServer stopped")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

