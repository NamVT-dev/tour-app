import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  getCurrentPositionAsync,
  PermissionStatus,
  useForegroundPermissions,
} from "expo-location";

import PlacesList from "../components/Places/PlacesList";
import { TourContext } from "../store/tour-context";
import IconButton from "../components/UI/IconButton";
import { Alert } from "react-native";
import { getAllTour, getTourWithin } from "../util/tour";
import LoadingOverlay from "../components/UI/LoadingOverlay.js";

function AllPlaces({ navigation }) {
  const tourCtx = useContext(TourContext);
  const [filteredTour, setFilteredTour] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  const [isLoading, setIsLoading] = useState(false);
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
      !locationPermissionInformation ||
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
    if (isNaN(+distance) || +distance < 0)
      return Alert.alert("Invalid input", "Please insert a number");
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const location = await getCurrentPositionAsync();
    const { latitude: lat, longitude: lng } = location.coords;
    try {
      setIsLoading(true);
      const newTours = await getTourWithin({ lat, lng }, distance);
      setFilteredTour(newTours);
      setDistance(distance);
      setIsFiltered(true);
    } catch (error) {
      Alert.alert("Failed!", "Something went wrong");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    async function fetchTour() {
      setIsLoading(true);
      try {
        const tours = await getAllTour();
        tourCtx.setToursList(tours);
      } catch (error) {
        Alert.alert("Failed!", "Something went wrong");
      }
      setIsLoading(false);
    }

    fetchTour();
  }, []);

  if (isFiltered) tourList = filteredTour;

  if (isLoading) return <LoadingOverlay message="Fetching Tour..." />;

  return (
    <PlacesList
      places={tourList}
      isFiltered={isFiltered}
      onClearFiltered={() => setIsFiltered(false)}
      distance={distance}
    />
  );
}

export default AllPlaces;
