import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    baseURL: "https://bus-booking-system-beige.vercel.app",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
