import axios from "axios";

export async function getAllTour() {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}tours`
  );

  return response.data.data.data;
}

export async function getTourWithin({ lat, lng }, distance) {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}tours/tours-within/${distance}/center/${lat},${lng}/unit/mi`
  );

  return response.data.data.data;
}
