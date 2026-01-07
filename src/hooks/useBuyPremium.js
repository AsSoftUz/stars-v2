// src/hooks/useBuyPremium.js
import { useState } from "react";
import api from "../api/axios";

const useBuyPremium = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const buyPremium = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/buy-premium/", data);
            setSuccess(true);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Premium sotib olishda xatolik yuz berdi");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { buyPremium, loading, error, success };
};

export default useBuyPremium;