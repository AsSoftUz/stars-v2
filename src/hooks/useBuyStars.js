import { useState } from "react";
import api from "../api/axios";

const useBuyStars = () => {
    const [loading, setLoading] = useState(false);
    
    const buyStars = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/stars-buy/", data);
            return response.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { buyStars, loading };
};

export default useBuyStars;