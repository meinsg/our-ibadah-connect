import React, { createContext, useContext } from "react";
import { useLocation } from "@/hooks/useLocation";

type LocationContextValue = ReturnType<typeof useLocation>;

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useLocation();
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useSharedLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useSharedLocation must be used within a LocationProvider");
  }

  return context;
};
