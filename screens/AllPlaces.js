import { useContext, useEffect } from "react";
import axios from "axios";

import PlacesList from "../components/Places/PlacesList";
import { TourContext } from "../store/tour-context";

function AllPlaces() {
  const tourCtx = useContext(TourContext);

  useEffect(() => {
    async function fetchTour() {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URI}tours`
      );
      tourCtx.setToursList(response.data.data.data);
    }

    fetchTour();
  }, []);

  return <PlacesList places={tourCtx.toursList} />;
}

export default AllPlaces;
