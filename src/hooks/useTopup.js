import { useState } from "react";
import api from "../api/axios";

const useTopup = () => {
    const [loading, setLoading] = useState(false);

    const submitTopup = async ({ amount, file }) => {
        setLoading(true);
        try {
            const tg = window.Telegram?.WebApp;
            const tgUser = tg?.initDataUnsafe?.user;

            const formData = new FormData();
            formData.append("amount", String(amount)); 
            formData.append("receipt_image", file); // Bu yerda 'file' haqiqiy File obyekti bo'lishi kerak
            
            // Backend user_id ni talab qilayotgan bo'lsa, uni ham qo'shamiz
            if (tgUser?.id) {
                formData.append("user_id", String(tgUser.id));
            }

            const res = await api.post("/invoices/", formData, {
                headers: {
                    // Muhim: Multipart yuborganda Content-Type ni Axios o'zi hal qilishi uchun buni o'chirib turamiz
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitTopup, loading };
};

export default useTopup;