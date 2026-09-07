import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getNetworkStatus,
  getOfflineOutbox,
  syncOfflineOutbox,
  NetworkStatus,
  OfflineQueuedReport
} from '../utils/networkOptimizer';
import { submitCitizenReport } from '../services/api';

interface NetworkContextType {
  networkStatus: NetworkStatus;
  liteMode: boolean;
  setLiteMode: (enabled: boolean) => void;
  toggleLiteMode: () => void;
  outbox: OfflineQueuedReport[];
  outboxCount: number;
  isSyncingOutbox: boolean;
  syncOutbox: () => Promise<{ successCount: number; errorCount: number; syncedTickets: string[] }>;
  refreshOutbox: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(getNetworkStatus());
  
  // Initialize Lite Mode from localStorage or auto-detect low-bandwidth
  const [liteMode, setLiteModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('varshanet_lite_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return getNetworkStatus().isLowBandwidth;
    } catch {
      return false;
    }
  });

  const [outbox, setOutbox] = useState<OfflineQueuedReport[]>(getOfflineOutbox());
  const [isSyncingOutbox, setIsSyncingOutbox] = useState(false);

  const refreshOutbox = useCallback(() => {
    setOutbox(getOfflineOutbox());
  }, []);

  const setLiteMode = (enabled: boolean) => {
    setLiteModeState(enabled);
    try {
      localStorage.setItem('varshanet_lite_mode', String(enabled));
    } catch (e) {
      console.warn('Could not save lite mode setting', e);
    }
  };

  const toggleLiteMode = () => {
    setLiteMode(!liteMode);
  };

  // Keep track of online/offline and connection changes
  useEffect(() => {
    const updateStatus = () => {
      const status = getNetworkStatus();
      setNetworkStatus(status);
      if (status.isLowBandwidth && localStorage.getItem('varshanet_lite_mode') === null) {
        setLiteModeState(true);
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const navAny = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const conn = navAny?.connection || navAny?.mozConnection || navAny?.webkitConnection;
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (conn && conn.removeEventListener) {
        conn.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  // Sync outbox queue
  const syncOutbox = useCallback(async () => {
    if (isSyncingOutbox) return { successCount: 0, errorCount: 0, syncedTickets: [] };
    setIsSyncingOutbox(true);
    try {
      const result = await syncOfflineOutbox(submitCitizenReport);
      refreshOutbox();
      return result;
    } finally {
      setIsSyncingOutbox(false);
    }
  }, [isSyncingOutbox, refreshOutbox]);

  // Auto-sync when coming back online
  useEffect(() => {
    const handleOnline = () => {
      console.log('[VARSHANET] Network restored: Attempting to sync offline outbox...');
      syncOutbox();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncOutbox]);

  return (
    <NetworkContext.Provider
      value={{
        networkStatus,
        liteMode,
        setLiteMode,
        toggleLiteMode,
        outbox,
        outboxCount: outbox.length,
        isSyncingOutbox,
        syncOutbox,
        refreshOutbox
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
