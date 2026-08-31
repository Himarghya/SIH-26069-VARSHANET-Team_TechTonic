import sys, os
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
with client.websocket_connect("/ws/weather") as ws:
    ws.send_text('{"type": "PING"}')
    res = ws.receive_text()
    print("WebSocket handshake and response SUCCESS:", res)