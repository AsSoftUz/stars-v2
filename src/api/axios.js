import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// So'rov yuborishdan oldin Telegram ma'lumotlarini qo'shish
api.interceptors.request.use(
  (config) => {
    const tg = window.Telegram?.WebApp;
    if (tg?.initData) {
      // Backendda bu ma'lumotni tekshirish uchun yuboramiz
      config.headers['Authorization'] = `Bearer ${tg.initData}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xatoliklarni markazlashgan holda boshqarish (ixtiyoriy)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Avtorizatsiya xatosi - foydalanuvchi tasdiqlanmadi.");
    }
    return Promise.reject(error);
  }
);

export default api;