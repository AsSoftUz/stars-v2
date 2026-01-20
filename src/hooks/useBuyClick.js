import { useState } from "react";
import api from "../api/axios";

const useBuyClick = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitTopup = async ({ user_id, amount }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Click odatda JSON qabul qiladi, FormData emas (fayl yo'q bo'lsa)
            const res = await api.post("/click/create/", {
                user_id: user_id,
                amount: Number(amount),
                password: import.meta.env.VITE_PASSWORD,
            });

            setSuccess(true);
            return res.data; // Ichida click_url bo'lishi kerak
        } catch (err) {
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

export default useBuyClick;