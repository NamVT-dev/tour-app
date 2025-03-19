import { useContext, useLayoutEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import { AuthContext } from "../store/auth-context";
import { getProfile } from "../util/auth";
import { Colors } from "../constants/colors";
import Button from "../components/UI/Button";
import IconButton from "../components/UI/IconButton";
import { useIsFocused } from "@react-navigation/native";

function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState({});
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    if (isFocused) {
      async function fetchProfile() {
        const profile = await getProfile(authCtx.token);
        if (!profile) {
          Alert.alert("Not logged in", "Please try login again");
          authCtx.logout();
        }
        setUserProfile(profile);
      }
      fetchProfile();
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
});
