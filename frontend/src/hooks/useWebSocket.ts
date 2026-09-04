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
    const getWsUrl = (): string => {
      if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const port = window.location.port ? `:${window.location.port}` : '';
        return `${protocol}//${window.location.hostname}${port === ':5173' ? ':8000' : port}/ws/weather`;
      }
      return 'ws://localhost:8000/ws/weather';
    };
    const wsUrl = getWsUrl();

    function connect() {
      if (isCancelled) return;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        let pingInterval: any = null;

        ws.onopen = () => {
          if (isCancelled) {
            try { ws.close(); } catch (_) {}
            return;
          }
          setIsConnected(true);
          retryDelay = 3000;
          
          // Heartbeat ping every 15 seconds to keep connection alive
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              try {
                ws.send(JSON.stringify({ type: 'PING' }));
              } catch (_) {}
            }
          }, 15000);
        };

        ws.onmessage = (event) => {
          if (isCancelled) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'PONG') return; // Heartbeat ack
            setLastMessage(data);
            if (callbackRef.current) {
              callbackRef.current(data);
            }
          } catch (err) {
            // Ignore non-json
          }
        };

        ws.onclose = () => {
          if (pingInterval) clearInterval(pingInterval);
          if (isCancelled) return;
          setIsConnected(false);
          reconnectTimer = setTimeout(() => {
            if (!isCancelled) {
              retryDelay = Math.min(retryDelay * 1.5, 10000);
              connect();
            }
          }, retryDelay);
        };

        ws.onerror = () => {
          if (pingInterval) clearInterval(pingInterval);
          setIsConnected(false);
        };
      } catch (e) {
        if (!isCancelled) {
          setIsConnected(false);
          reconnectTimer = setTimeout(connect, 4000);
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
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        
        // In React 18 StrictMode, do not force-close while in CONNECTING state to avoid browser console error
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
          ws.onopen = () => {
            try { ws.close(); } catch (_) {}
          };
        }
        wsRef.current = null;
      }
    };
  }, []);

  return { isConnected, lastMessage };
}