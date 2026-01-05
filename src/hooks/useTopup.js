// src/hooks/useTopup.js
import { useState } from "react";
import api from "../api/axios";

const useTopup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitTopup = async ({ user_id, amount, file }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Fayl yuborish uchun FormData ishlatamiz
            const formData = new FormData();
            formData.append("user_id", String(user_id)); // Stringga o'tkazish xavfsizroq
            formData.append("amount", String(amount));  // Schema string so'rayotgan bo'lishi mumkin
            formData.append("receipt_image", file);     // Fayl obyekti

            const res = await api.post("/invoices/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess(true);
            return res.data;
        } catch (err) {
            // Serverdan kelgan aniq xatolikni ko'rish:
            const message = err.response?.data 
                ? JSON.stringify(err.response.data) 
                : err.message || "Noma'lum xatolik";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitTopup, loading, error, success };
};

export default useTopup;