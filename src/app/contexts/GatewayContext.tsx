import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Gateway {
  id: string;
  name: string;
  location: string;
  setupSSID: string;
  status: 'online' | 'offline';
  createdAt: Date;
}

interface WiFiConfig {
  ssid: string;
  password: string;
  location: string;
}

interface GatewayContextType {
  gateways: Gateway[];
  addGateway: (gateway: Gateway) => void;
  getGateway: (id: string) => Gateway | undefined;
  selectedGateway: Gateway | null;
  setSelectedGateway: (gateway: Gateway | null) => void;
  wifiConfig: WiFiConfig | null;
  setWifiConfig: (config: WiFiConfig | null) => void;
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

export function GatewayProvider({ children }: { children: ReactNode }) {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const [wifiConfig, setWifiConfig] = useState<WiFiConfig | null>(null);

  const addGateway = useCallback((gateway: Gateway) => {
    setGateways((prev) => [...prev, gateway]);
  }, []);

  const getGateway = useCallback((id: string) => {
    return gateways.find((gw) => gw.id === id);
  }, [gateways]);

  return (
    <GatewayContext.Provider
      value={{
        gateways,
        addGateway,
        getGateway,
        selectedGateway,
        setSelectedGateway,
        wifiConfig,
        setWifiConfig,
      }}
    >
      {children}
    </GatewayContext.Provider>
  );
}

export function useGateway() {
  const context = useContext(GatewayContext);
  if (!context) {
    throw new Error('useGateway must be used within GatewayProvider');
  }
  return context;
}