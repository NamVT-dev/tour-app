import { useContext, useLayoutEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { Colors } from "../constants/colors";

import Button from "../components/UI/Button";
import IconButton from "../components/UI/IconButton";

import { getProfile } from "../util/auth";
import { getBooking } from "../util/checkout";

import { AuthContext } from "../store/auth-context";
import BookingItem from "../components/Profile/BookingItem";
import { formatDate } from "../util/format";
import LoadingOverlay from "../components/UI/LoadingOverlay";

function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState({});
  const [bookingList, setBookingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    if (isFocused) {
      async function fetchProfile() {
        try {
          setIsLoading(true);
          const profile = await getProfile(authCtx.token);
          setUserProfile(profile);
        } catch (error) {
          Alert.alert("Not logged in", "Please try login again");
          authCtx.logout();
        }
        setIsLoading(false);
      }
      fetchProfile();
    }
  }, [isFocused, authCtx]);

  useLayoutEffect(() => {
    if (isFocused) {
      async function fetchBooking() {
        try {
          setIsLoading(true);
          const bookings = await getBooking(authCtx.token);
          setBookingList(bookings);
        } catch (error) {
          Alert.alert("Error", "Some thing went wrong while fetching booking");
        }
        setIsLoading(false);
      }
      fetchBooking();
    }
  }, [isFocused, authCtx]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="exit"
          size={24}
          color={tintColor}
          onPress={() => {
            Alert.alert("Logging out", "Do you want to log out?", [
              {
                text: "No",
                onPress: () => {},
                style: "destructive",
              },
              {
                text: "Yes",
                onPress: () => {
                  authCtx.logout();
                },
              },
            ]);
          }}
        />
      ),
    });
  });

  function editProfileHandler() {
    navigation.navigate("ManageProfile", {
      profile: userProfile,
    });
  }

  function bookingItemHandler({ item }) {
    return (
      <BookingItem
        tourName={item.tour?.name}
        paid={item.paid}
        price={item.price}
        createdAt={formatDate(item.createdAt)}
      />
    );
  }

  if (isLoading) return <LoadingOverlay message="Fetching user data..." />;

  return (
    <View style={styles.profileContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: userProfile.photo,
          }}
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{userProfile.name}</Text>
        <Text style={styles.email}>{userProfile.email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={editProfileHandler}>
          Edit profile
        </Button>
      </View>
      <Text style={styles.bookingTitle}>Booking</Text>
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cell}>Tour Name</Text>
        <Text style={styles.cell}>Price</Text>
        <Text style={styles.cell}>Paid</Text>
        <Text style={styles.cell}>Created At</Text>
      </View>
      <FlatList
        data={bookingList}
        keyExtractor={(item) => item._id}
        renderItem={bookingItemHandler}
      />
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: Colors.primary500,
  },
  detailsContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary100,
  },
  email: {
    fontSize: 16,
    color: Colors.accent500,
    marginTop: 5,
  },
  button: {
    marginTop: 12,
    width: "60%",
  },
  buttonContainer: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.primary500,
    alignItems: "center",
    backgroundColor: Colors.primary700,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: Colors.primary50,
    fontSize: 14,
    fontWeight: "bold",
  },
  bookingTitle: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary400,
  },
});
