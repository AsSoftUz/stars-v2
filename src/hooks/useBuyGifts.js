// src/hooks/useBuyGifts.js
import { useState } from "react";
import api from "../api/axios";

const useBuyGifts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const buyGifts = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/referralgifts/gift-requests/", data);
            setSuccess(true);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Gift sotib olishda xatolik yuz berdi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { buyGifts, loading, error, success };
};

export default useBuyGifts;