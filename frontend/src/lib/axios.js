import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://chat-app-t4b5.onrender.com/api" : "/api",
  withCredentials: true,
});
