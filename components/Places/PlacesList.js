import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";

function PlacesList({ places }) {
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
    <FlatList
      style={styles.list}
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PlaceItem
          place={item}
          onSelect={selectPlaceHandler.bind(this, item)}
        />
      )}
    />
  );
}

export default PlacesList;

const styles = StyleSheet.create({
  list: { margin: 24 },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.primary200,
  },
});
