import { useState, useEffect } from "react";
import api from "../api/axios"; 

const useGetPremium = () => {
    const [premiumOptions, setPremiumOptions] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.error("Premium planlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPremium();
    }, []);

    return { premiumOptions, loading, refetch: fetchPremium };
};

export default useGetPremium;