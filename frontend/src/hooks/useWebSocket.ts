import { useEffect, useRef, useState } from 'react';

export function useWeatherWebSocket(onMessageReceived?: (data: any) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const callbackRef = useRef(onMessageReceived);

  useEffect(() => {
    callbackRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    let isCancelled = false;
    let reconnectTimer: any = null;
    let retryDelay = 3000;
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/weather';

    function connect() {
      if (isCancelled) return;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (isCancelled) {
            ws.close();
            return;
          }
          setIsConnected(true);
          retryDelay = 3000; // reset delay on successful connection
        };

        ws.onmessage = (event) => {
          if (isCancelled) return;
          try {
            const data = JSON.parse(event.data);
            setLastMessage(data);
            if (callbackRef.current) {
              callbackRef.current(data);
            }
          } catch (err) {
            // Ignore non-json or ping-pong
          }
        };

        ws.onclose = () => {
          if (isCancelled) return;
          setIsConnected(false);
          // Exponential backoff up to 15s to prevent console spam when backend is restarting
          reconnectTimer = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 1.5, 15000);
            connect();
          }, retryDelay);
        };

        ws.onerror = () => {
          // Browser will automatically trigger onclose, no manual ws.close() needed
          setIsConnected(false);
        };
      } catch (e) {
        if (!isCancelled) {
          setIsConnected(false);
          reconnectTimer = setTimeout(connect, 5000);
        }
      }
    }

    connect();

    return () => {
      isCancelled = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (wsRef.current) {
        const ws = wsRef.current;
        // Detach listeners before closing to prevent StrictMode loops
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
        wsRef.current = null;
      }
    };
  }, []);

  return { isConnected, lastMessage };
}