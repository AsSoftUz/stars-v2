import { useState } from "react";
import api from "../api/axios";

const useTopup = () => {
    const [loading, setLoading] = useState(false);

    const submitTopup = async ({ amount, file }) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("amount", String(amount)); 
            formData.append("receipt_image", file); 

            const res = await api.post("/invoices/", formData);
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