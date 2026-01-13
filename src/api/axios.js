import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 0,
  headers: {
    // "Content-Type": "application/json",
  },
  withCredentials: false,
}); 

export default api;
