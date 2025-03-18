import { useContext, useState } from "react";
import { AuthContext } from "../store/auth-context";
import AuthContent from "../components/Auth/AuthContent";
import { register } from "../util/auth";
import { Alert } from "react-native";
import LoadingOverlay from "../components/UI/LoadingOverlay";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signUpHandler({ name, email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await register(name, email, password);
      authCtx.authenticate(token);
    } catch (error) {
      console.log(JSON.stringify(error.response));
      Alert.alert("Authentication failed", error.response.data.message);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;
