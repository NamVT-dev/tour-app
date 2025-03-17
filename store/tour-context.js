import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const TourContext = createContext({
  toursList: [],
});

function TourProvider({ children }) {
  const [toursList, setToursList] = useState([]);

  useEffect(() => {
    async function fetchTour() {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URI}tours`
      );
      setToursList(response.data.data.data);
    }

    fetchTour();
  }, []);

  const value = {
    toursList,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export default TourProvider;
