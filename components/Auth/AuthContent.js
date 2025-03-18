import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import validator from "validator";
import AuthForm from "./AuthForm";
import Button from "../UI/Button";
import { Colors } from "../../constants/colors";

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    name: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }
  function submitHandler(credentials) {
    let { name, email, password, passwordConfirm } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = validator.isEmail(email);
    const passwordIsValid = validator.isStrongPassword(password);
    const passwordsAreEqual = password === passwordConfirm;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!passwordsAreEqual || !name.trim()))
    ) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        name: !name.trim(),
        email: !emailIsValid,
        password: !passwordIsValid,
        passwordConfirm: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    if (isLogin) {
      onAuthenticate({ email, password });
    } else {
      onAuthenticate({ name, email, password });
    }
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <Button style={styles.button} onPress={switchAuthModeHandler}>
          {isLogin ? "Create a new user" : "Log in instead"}
        </Button>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
  button: {
    backgroundColor: Colors.primary500,
  },
});
