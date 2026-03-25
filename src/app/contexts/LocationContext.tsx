import React, { createContext, useContext, useState } from 'react';

interface LocationContextType {
  mainLocation: string;
  setMainLocation: (location: string) => void;
  roomLocation: string;
  setRoomLocation: (location: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [mainLocation, setMainLocation] = useState<string>('');
  const [roomLocation, setRoomLocation] = useState<string>('');

  return (
    <LocationContext.Provider
      value={{
        mainLocation,
        setMainLocation,
        roomLocation,
        setRoomLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
