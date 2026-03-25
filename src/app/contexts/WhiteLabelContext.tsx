import React, { createContext, useContext, useState } from 'react';

export interface WhiteLabelConfig {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  accentColor: string;
}

interface WhiteLabelContextType {
  config: WhiteLabelConfig;
  updateConfig: (config: Partial<WhiteLabelConfig>) => void;
}

const defaultConfig: WhiteLabelConfig = {
  brandName: 'Gateway',
  primaryColor: '#6366f1', // indigo-500
  secondaryColor: '#8b5cf6', // violet-500
  accentColor: '#06b6d4', // cyan-500
};

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export function WhiteLabelProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<WhiteLabelConfig>(() => {
    const saved = localStorage.getItem('gateway-whitelabel');
    return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
  });

  const updateConfig = (newConfig: Partial<WhiteLabelConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem('gateway-whitelabel', JSON.stringify(updated));
    
    // Update CSS variables for dynamic theming
    document.documentElement.style.setProperty('--brand-primary', updated.primaryColor);
    document.documentElement.style.setProperty('--brand-secondary', updated.secondaryColor);
    document.documentElement.style.setProperty('--brand-accent', updated.accentColor);
  };

  return (
    <WhiteLabelContext.Provider value={{ config, updateConfig }}>
      {children}
    </WhiteLabelContext.Provider>
  );
}

export function useWhiteLabel() {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within WhiteLabelProvider');
  }
  return context;
}
