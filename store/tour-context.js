import { createContext, useState } from "react";

export const TourContext = createContext({
  toursList: [],
  setToursList: () => {},
});

function TourProvider({ children }) {
  const [toursList, setToursList] = useState([]);

  const value = {
    toursList,
    setToursList,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export default TourProvider;
