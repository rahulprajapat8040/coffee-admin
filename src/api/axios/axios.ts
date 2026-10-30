import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  // required for cookies
  withCredentials: true,

  timeout: 15000,
});
