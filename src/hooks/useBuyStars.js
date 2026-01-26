import { useState } from "react";
import api from "../api/axios";

const useBuyStars = () => {
    const [loading, setLoading] = useState(false);
    
    const buyStars = async (payload) => {
        setLoading(true);
        try {
            // Agar payload ichida user_id kutilmaganda kelmay qolsa, 
            // Telegram WebApp dan olishga harakat qilamiz
            if (!payload.user_id) {
                const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                if (tgUser?.id) {
                    payload.user_id = String(tgUser.id);
                }
            }

            const response = await api.post("/stars-buy/", payload);
            return response.data;
        } catch (err) {
            console.error("Buy Stars Error:", err.response?.data);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { buyStars, loading };
};

export default useBuyStars;