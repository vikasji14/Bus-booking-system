import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    baseURL: "https://bus-booking-system-beige.vercel.app",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Access-Control-Allow-Origin": "https://bus-booking-system-1bk7.vercel.app",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    withCredentials: true,

  },
});
