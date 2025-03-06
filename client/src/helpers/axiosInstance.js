import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://bus-booking-system-ed2p.vercel.app",
  withCredentials: true, 
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },

});
