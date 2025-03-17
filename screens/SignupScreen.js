import { useContext, useState } from "react";
import { AuthContext } from "../store/auth-context";
import AuthContent from "../components/Auth/AuthContent";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signUpHandler({ email, password }) {}
  return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;
