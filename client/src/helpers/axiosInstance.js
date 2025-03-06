import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    baseURL: "https://bus-booking-system-ed2p.vercel.app",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    withCredentials: true,

  },
});
