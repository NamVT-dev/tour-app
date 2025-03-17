import { useContext, useState } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../store/auth-context";
import AuthContent from "../components/Auth/AuthContent";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {}

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
