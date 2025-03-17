import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import { Colors } from "../constants/colors";
import { useLayoutEffect } from "react";
import { formatDate, formatPrice } from "../util/format";
import Button from "../components/UI/Button";

function PlaceDetails({ route, navigation }) {
  const place = route.params.place;

  function showOnMapHandler() {
    navigation.navigate("Map", {
      startLocation: place.startLocation,
      locations: place.locations,
    });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: place.name,
    });
  }, [route]);

  if (!place) {
    return (
      <View>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: place.imageCover }} />
      <View style={styles.tourContainer}>
        <View style={styles.startLocationContainer}>
          <Text style={styles.startLocation}>Start Location</Text>
        </View>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{place.startLocation.address}</Text>
          <Text style={styles.date}>{formatDate(place.startDates?.[0])}</Text>
        </View>
        <View style={styles.locationsTitleContainer}>
          <Text style={styles.locationTitle}>Location</Text>
          <Text style={styles.locationTitle}>Day</Text>
        </View>
        {place.locations?.map((location) => (
          <View
            key={location.id}
            style={[styles.locationsTitleContainer, styles.locationContainer]}
          >
            <Text style={styles.address}>{location.address}</Text>
            <Text style={styles.date}>{location.day}</Text>
          </View>
        ))}
        <OutlinedButton
          style={styles.mapButton}
          icon="map"
          onPress={showOnMapHandler}
        >
          View on Map
        </OutlinedButton>
        <Button style={styles.priceButton}>
          Only {formatPrice(place.price, "VND")}
        </Button>
      </View>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  tourContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 36,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  date: {
    color: Colors.accent500,
  },
  priceButton: {
    marginVertical: 16,
    justifyContent: "center",
    height: 50,
    width: 200,
    backgroundColor: "green",
  },
  startLocationContainer: {
    marginTop: 16,
  },
  startLocation: {
    color: Colors.primary50,
    fontWeight: "bold",
    fontSize: 20,
  },
  locationsTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 36,
  },
  locationTitle: {
    color: Colors.primary50,
    fontWeight: "bold",
    fontSize: 20,
  },
  locationContainer: {
    marginVertical: 6,
  },
  mapButton: {
    marginTop: 16,
  },
});
