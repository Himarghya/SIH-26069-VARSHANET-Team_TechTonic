import sys
import os

# Universal sys.path configuration for Vercel Serverless environment
_current_dir = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.dirname(_current_dir)
_backend_dir = os.path.join(_project_root, "backend")

for _p in [_project_root, _backend_dir, os.path.join(_backend_dir, "app")]:
    if _p and os.path.exists(_p) and _p not in sys.path:
        sys.path.insert(0, _p)

from backend.app.main import app

# Vercel looks for 'app' or 'handler'
handler = app

