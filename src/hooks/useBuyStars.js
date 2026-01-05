// src/hooks/useBuyStars.js
import { useState } from "react";
import api from "../api/axios";

const useBuyStars = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const buyStars = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/stars-buy/", data);
            setSuccess(true);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Sotib olishda xatolik yuz berdi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { buyStars, loading, error, success };
};

export default useBuyStars;