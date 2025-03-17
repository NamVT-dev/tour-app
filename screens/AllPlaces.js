import { useContext, useEffect } from "react";
import PlacesList from "../components/Places/PlacesList";
import { TourContext } from "../store/tour-context";

function AllPlaces({ route }) {
  const tourCtx = useContext(TourContext);

  return <PlacesList places={tourCtx.toursList} />;
}

export default AllPlaces;
