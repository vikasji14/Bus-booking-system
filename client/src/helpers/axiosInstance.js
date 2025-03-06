import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    baseURL: "https://bus-booking-system-mauve.vercel.app",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
