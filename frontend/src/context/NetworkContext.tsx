import { createContext, ReactNode, useContext } from 'react';

interface NetworkContextType {
  online: boolean;
  lastOnlineAt: Date | null;
  lastOfflineAt: Date | null;
}

// Create a context that always reports as online
const NetworkContext = createContext<NetworkContextType>({
  online: true,
  lastOnlineAt: new Date(),
  lastOfflineAt: null
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: ReactNode;
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  // Always online implementation
  const value = {
    online: true,
    lastOnlineAt: new Date(),
    lastOfflineAt: null
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}