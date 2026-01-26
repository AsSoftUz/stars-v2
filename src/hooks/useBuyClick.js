import { useState } from "react";
import api from "../api/axios";

const useBuyClick = () => {
    const [loading, setLoading] = useState(false);

    const submitClickTopup = async ({ amount }) => {
        setLoading(true);
        try {
            const res = await api.post("/click/create/", { 
                amount: Number(amount) 
            });

            return res.data; 
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitTopup: submitClickTopup, loading };
};

export default useBuyClick;