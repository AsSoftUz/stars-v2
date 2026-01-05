// src/hooks/usePremium.js
import { useState, useEffect } from "react";
import api from "../api/axios"; 

const useGetPremium = () => {
    const [premiumOptions, setPremiumOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPremium = async () => {
        try {
            setLoading(true);
            const res = await api.get("/premium/"); 
            const activePlans = res.data
                .filter(item => item.is_active)
                .map(item => ({
                    ...item,
                    perMonth: Math.round(Math.abs(parseFloat(item.price)) / item.duration).toLocaleString(),
                    formattedPrice: Math.abs(parseFloat(item.price)).toLocaleString()
                }));
            setPremiumOptions(activePlans);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- SATIB OLISH FUNKSIYASI ---
    const buyPremium = async (data) => {
        try {
            // data tarkibi: { user_id, username, duration }
            const res = await api.post("/buy-premium/", data);
            return res.data;
        } catch (err) {
            // Serverdan kelgan xatolik xabarini qaytarish
            throw err.response?.data?.error || "Sotib olishda xatolik yuz berdi";
        }
    };

    useEffect(() => {
        fetchPremium();
    }, []);

    return { premiumOptions, loading, error, buyPremium, refetch: fetchPremium };
};

export default useGetPremium;