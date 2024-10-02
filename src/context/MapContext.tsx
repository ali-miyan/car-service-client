import { createContext, useState, ReactNode, useContext } from "react";

interface LocationContextProps {
  latitude: number;
  longitude: number;
  address: string;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
  setAddress: (address: string) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(
  undefined
);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [latitude, setLatitude] = useState(11.1722607144428);
  const [longitude, setLongitude] = useState(75.940202);
  const [address, setAddress] = useState("");

  return (
    <LocationContext.Provider
      value={{
        latitude,
        longitude,
        address,
        setLatitude,
        setLongitude,
        setAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
