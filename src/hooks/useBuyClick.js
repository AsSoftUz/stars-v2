import { useState } from "react";
import api from "../api/axios";

const useBuyClick = () => {
    const [loading, setLoading] = useState(false);

    const submitClickTopup = async ({ amount }) => {
        setLoading(true);
        try {
            const tg = window.Telegram?.WebApp;
            const tgUser = tg?.initDataUnsafe?.user;

            // Xavfsizlik uchun: agar tgUser topilmasa xato tashlaymiz
            if (!tgUser?.id) {
                throw new Error("Telegram user data not found");
            }

            const res = await api.post("/click/create/", {
                user_id: String(tgUser.id),
                amount: Number(amount) 
            });

            return res.data; 
        } catch (err) {
            // Xatoni konsolda ko'rish uchun (ixtiyoriy)
            console.error("Click topup error:", err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitTopup: submitClickTopup, loading };
};

export default useBuyClick;