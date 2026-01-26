import { useState } from "react";
import api from "../api/axios";

const useBuyGifts = () => {
    const [loading, setLoading] = useState(false);

    const buyGifts = async (giftData) => {
        setLoading(true);
        try {
            const response = await api.post("/referralgifts/gift-requests/", giftData);
            return response.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { buyGifts, loading };
};

export default useBuyGifts;