import { useState, useEffect } from "react";
import api from "../api/axios";

const useGetStars = () => {
    const [starsOptions, setStarsOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStars = async () => {
        try {
            setLoading(true);
            const res = await api.get("/stars/");
            
            const activeStars = res.data.filter(item => item.is_active);
            setStarsOptions(activeStars);
        } catch (err) {
            console.error("Stars yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStars(); }, []);

    return { starsOptions, loading, refetch: fetchStars };
};

export default useGetStars;