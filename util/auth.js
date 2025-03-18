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

export async function register(name, email, password) {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}user/signup`,
    {
      name,
      email,
      password,
      passwordConfirm: password,
    }
  );

  const token = response.data.token;

  return token;
}

export async function getProfile(token) {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}user/me`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response.data.data.data;
}

export async function changPassword(
  token,
  { currentPassword, newPassword, passwordConfirm }
) {
  const response = await axios.patch(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}user/updateMyPassword`,
    {
      passwordCurrent: currentPassword,
      password: newPassword,
      passwordConfirm: passwordConfirm,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const newToken = response.data.token;
  return newToken;
}

export async function updateProfile(token, data) {
  await axios.patch(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}user/updateMe`,
    data,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
}

export async function updatePhoto(token, photo) {
  const formData = new FormData();
  formData.append("photo", {
    uri: photo.uri,
    name: "photo.jpg",
    type: photo.mimeType,
  });
  await axios.patch(
    `${process.env.EXPO_PUBLIC_BACKEND_URI}user/updateMe`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
    }
  );
}
