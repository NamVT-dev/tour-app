import { useContext, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../constants/colors";
import Button from "../components/UI/Button";
import { AuthContext } from "../store/auth-context";
import { changPassword, updatePhoto, updateProfile } from "../util/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import * as ImagePicker from "expo-image-picker";
import IconButton from "../components/UI/IconButton";

function ManageProfileScreen({ navigation, route }) {
  const { profile } = route.params;
  const authCtx = useContext(AuthContext);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [cameraPermissionInformation, requestPermission] =
    ImagePicker.useCameraPermissions();

  const [photo, setPhoto] = useState({ uri: profile.photo });
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  async function changePasswordHandler() {
    if (!isChangePassword) {
      setIsChangePassword(true);
      return;
    }

    try {
      setIsAuthenticating(true);
      const newToken = await changPassword(authCtx.token, {
        currentPassword,
        newPassword,
        passwordConfirm,
      });

      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirm("");

      authCtx.authenticate(newToken);
      Alert.alert("Sucess", "Password has been changed");
    } catch (error) {
      Alert.alert("Change password failed", error.response.data.message);
    }

    setIsAuthenticating(false);
    setIsChangePassword(false);
  }

  async function onSaveHandler() {
    if (isChangePassword) {
      Alert.alert("Password not saved", "Please save your password first!");
      return;
    }

    try {
      setIsAuthenticating(true);
      await updateProfile(authCtx.token, { name, email });
    } catch (error) {
      Alert.alert("Something went wrong", error.response.message);
    }
    setIsAuthenticating(false);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function pickImageHandler() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    } else return;

    try {
      setIsAuthenticating(true);
      await updatePhoto(authCtx.token, result.assets[0]);
    } catch (error) {
      Alert.alert("Something went wrong", error.response.message);
    }
    setIsAuthenticating(false);
  }

  async function verifyPermissions() {
    if (
      cameraPermissionInformation.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (
      cameraPermissionInformation.status === ImagePicker.PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app"
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const imageTaken = image.assets[0];

    setPhoto(imageTaken);

    try {
      setIsAuthenticating(true);
      await updatePhoto(authCtx.token, imageTaken);
    } catch (error) {
      Alert.alert("Something went wrong", error.response.message);
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return (
      <LoadingOverlay
        message={isChangePassword ? "Saving password..." : "Saving..."}
      />
    );
  }

  return (
    <View style={styles.profileContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: photo.uri,
          }}
        />
      </View>
      <View style={styles.iconButtonContainer}>
        <IconButton
          style={styles.iconButton}
          color="white"
          icon="camera"
          size={24}
          onPress={takeImageHandler}
        />
        <IconButton
          style={styles.iconButton}
          color="white"
          icon="cloud-upload"
          size={24}
          onPress={pickImageHandler}
        />
      </View>
      <View style={styles.detailsContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={Colors.gray500}
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor={Colors.gray500}
        />
        {isChangePassword && (
          <>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current Password..."
              placeholderTextColor={Colors.gray500}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password..."
              placeholderTextColor={Colors.gray500}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              placeholder="Confirm password..."
              placeholderTextColor={Colors.gray500}
              secureTextEntry
            />
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={changePasswordHandler}>
          {isChangePassword ? "Save Password" : "Change password"}
        </Button>
        <Button style={styles.button} onPress={onSaveHandler}>
          Save
        </Button>
      </View>
      <View style={styles.cancelContainer}>
        <Button style={styles.cancelButton} onPress={cancelHandler}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

export default ManageProfileScreen;

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
    width: "100%",
  },
  input: {
    width: "80%",
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary500,
    marginBottom: 10,
    textAlign: "center",
    color: Colors.accent500,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
  cancelContainer: {
    alignItems: "center",
  },
  cancelButton: {
    width: "40%",
    backgroundColor: Colors.error700,
    marginTop: 8,
  },
  iconButtonContainer: {
    flexDirection: "row",
  },
  iconButton: {
    flex: 1,
  },
});
