import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, 
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },

});
