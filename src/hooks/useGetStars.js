// src/hooks/useStars.js
import { useState, useEffect } from "react";
import api from "../api/axios"; // O'zingizning axios instansingizga yo'l

const useGetStars = () => {
    const [starsOptions, setStarsOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStars = async () => {
        try {
            setLoading(true);
            const res = await api.get("/stars/"); // API manzilingiz
            // Faqat is_active: true bo'lganlarini saralab olamiz
            const activeStars = res.data.filter(item => item.is_active);
            console.log(activeStars);
            
            setStarsOptions(activeStars);
        } catch (err) {
            setError(err.message || "Stars yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStars();
    }, []);

    return { starsOptions, loading, error, refetch: fetchStars };
};

export default useGetStars;