import { useContext, useLayoutEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { formatDate, formatPrice } from "../util/format";
import { getCheckoutSession } from "../util/checkout";

import Button from "../components/UI/Button";
import OutlinedButton from "../components/UI/OutlinedButton";
import { AuthContext } from "../store/auth-context";

import { Colors } from "../constants/colors";
import LoadingOverlay from "../components/UI/LoadingOverlay";

function PlaceDetails({ route, navigation }) {
  const place = route.params.place;
  const authCtx = useContext(AuthContext);

  const [isLoadingSession, setIsLoadingSession] = useState(false);

  function showOnMapHandler() {
    navigation.navigate("Map", {
      startLocation: place.startLocation,
      locations: place.locations,
    });
  }

  async function checkoutHandler() {
    try {
      setIsLoadingSession(true);
      const checkoutUri = await getCheckoutSession(authCtx.token, place.id);
      navigation.navigate("CheckoutSession", {
        checkoutUri,
      });
    } catch (error) {
      Alert.alert("Failed", "Something went wrong. Please try again later");
    }
    setIsLoadingSession(false);
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

  if (isLoadingSession) return <LoadingOverlay message="Loading session..." />;

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
        <Button style={styles.priceButton} onPress={checkoutHandler}>
          Only {formatPrice(place.price, "VND")}
        </Button>
      </View>
      <View style={styles.guidesContainer}>
        <View style={styles.guidesTitleContainer}>
          <Text style={styles.guidesTitle}>Guides</Text>
          <Text style={styles.guidesTitle}>Role</Text>
        </View>
        {place.guides.length > 0 &&
          place.guides.map((guide) => (
            <View key={guide._id} style={styles.guideInfoContainer}>
              <View style={styles.guide}>
                <Image
                  style={styles.guidesImage}
                  source={{ uri: guide.photo }}
                />
                <Text style={styles.guideName}>{guide.name}</Text>
              </View>
              <View style={styles.guide}>
                <Text style={styles.guideRole}>{guide.role.toUpperCase()}</Text>
              </View>
            </View>
          ))}
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
  guidesContainer: {
    marginBottom: 36,
    marginHorizontal: 36,
  },
  guideInfoContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  guide: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "center",
  },
  guideName: {
    color: Colors.accent500,
    marginLeft: 4,
  },
  guideRole: {
    color: Colors.primary700,
    fontWeight: "bold",
    fontSize: 16,
  },
  guidesTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 4,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: Colors.primary200,
  },
  guidesTitle: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary50,
  },
  guidesImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
