import axios from "axios";

export async function login(email, password) {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}user/login`,
    {
      email,
      password,
    }
  );
  const token = response.data.token;

  return token;
}
