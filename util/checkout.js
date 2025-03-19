import axios from "axios";

export async function getCheckoutSession(token, tourId) {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}bookings/checkout-session/${tourId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const sessionUri = response.data.session.url;
  return sessionUri;
}
