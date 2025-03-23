import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";
import IconButton from "../UI/IconButton";

function PlacesList({ places, isFiltered, onClearFiltered, distance }) {
  const navigation = useNavigation();

  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No tour found!</Text>
      </View>
    );
  }

  function selectPlaceHandler(place) {
    navigation.navigate("PlaceDetails", {
      place,
    });
  }

  return (
    <>
      {isFiltered && (
        <View style={styles.filterDetailContainer}>
          <Text style={styles.tourDistanceText}>
            Showing tour within {distance}km near you
          </Text>
          <IconButton
            icon="eye-off"
            size={24}
            color="white"
            onPress={onClearFiltered}
          />
        </View>
      )}
      <FlatList
        style={[styles.list, !isFiltered && styles.notFilteredList]}
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlaceItem
            place={item}
            onSelect={selectPlaceHandler.bind(this, item)}
          />
        )}
      />
    </>
  );
}

export default PlacesList;

const styles = StyleSheet.create({
  list: { marginHorizontal: 24 },
  notFilteredList: { marginVertical: 24 },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.primary200,
  },
  filterDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
  },
  tourDistanceText: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.primary700,
  },
});
