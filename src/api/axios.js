import axios from "axios";

// Axios instansiyasini yaratish
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// So'rov yuborilishidan oldin headerga API Key qo'shish uchun Interceptor
api.interceptors.request.use(
  (config) => {
    // .env faylingizdagi kalit nomi VITE_API_KEY ekanligini tekshiring
    const apiKey = import.meta.env.VITE_API_KEY;

    if (apiKey) {
      // Rasmda ko'rsatilganidek X-API-Key nomli header qo'shamiz
      config.headers["X-API-Key"] = apiKey;
    }

    // Debug uchun: Qaysi URL'ga qanday headers ketayotganini ko'rish (ixtiyoriy)
    console.log('Request Headers:', config.headers);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;