import React, { createContext, useContext, useState, useEffect } from 'react';
import { offlineSync } from '../services/offlineSync';

interface NetworkContextType {
  isOnline: boolean;
  toggleNetwork: () => void;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  toggleNetwork: () => {},
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = offlineSync.subscribe((status) => {
      setIsOnline(status);
    });
    return () => unsubscribe();
  }, []);

  const toggleNetwork = () => {
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    offlineSync.setOnlineStatus(nextStatus);
  };

  return (
    <NetworkContext.Provider value={{ isOnline, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
