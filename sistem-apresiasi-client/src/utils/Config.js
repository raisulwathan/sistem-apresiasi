// utils/Config.js
import axios from "axios";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const saveTokenToLocalStorage = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const refreshToken = async () => {
  try {
    const response = await axios.post("http://localhost:5001/api/v1/authentications" /* data yang diperlukan */);
    const newToken = response.data.token;
    saveTokenToLocalStorage(newToken);
    // Lakukan tindakan lain setelah mendapatkan token yang baru
    // ...
  } catch (error) {
    // Penanganan kesalahan saat gagal mendapatkan token yang baru
    // ...
  }
};
