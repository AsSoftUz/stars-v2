import { useState } from "react";
import api from "../api/axios";

const useBuyPremium = () => {
    const [loading, setLoading] = useState(false);

    const buyPremium = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/buy-premium/", data);
            return response.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { buyPremium, loading };
};

export default useBuyPremium;