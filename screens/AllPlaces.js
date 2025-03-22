import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { PermissionStatus, useForegroundPermissions } from "expo-location";

import PlacesList from "../components/Places/PlacesList";
import { TourContext } from "../store/tour-context";
import IconButton from "../components/UI/IconButton";
import { Alert } from "react-native";
import { getAllTour, getTourWithin } from "../util/tour";

function AllPlaces({ navigation }) {
  const tourCtx = useContext(TourContext);
  const [filteredTour, setFilteredTour] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  let tourList = tourCtx.toursList;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: ({ tintColor }) => (
        <IconButton
          icon="filter"
          color={tintColor}
          size={24}
          onPress={filterTourHandler}
        />
      ),
    });
  }, []);

  function filterTourHandler() {
    Alert.prompt("Find tour near you", "Enter distance you want to find (km)", [
      { text: "Cancel", style: "destructive" },
      { text: "Find", isPreferred: true, onPress: getFilterTourHandler },
    ]);
  }

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this function"
      );
      return false;
    }

    return true;
  }

  async function getFilterTourHandler(distance) {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    const { latitude: lat, longitude: lng } = location.coords;
    try {
      const newTours = await getTourWithin({ lat, lng }, distance);
      setFilteredTour(newTours);
    } catch (error) {}
  }

  useEffect(() => {
    async function fetchTour() {
      const tours = await getAllTour();
      tourCtx.setToursList(tours);
    }

    fetchTour();
  }, []);

  return <PlacesList places={tourList} />;
}

export default AllPlaces;
