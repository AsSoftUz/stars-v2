import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useTelegramBack = (targetPath = "/") => {
    const navigate = useNavigate();
    const tg = window.Telegram.WebApp;

    useEffect(() => {
        const backButton = tg.BackButton;
        
        backButton.show();

        const handleBack = () => {
            navigate(targetPath);
        };

        backButton.onClick(handleBack);

        // Sahifadan chiqib ketganda tugmani yashirish
        return () => {
            backButton.hide();
            backButton.offClick(handleBack);
        };
    }, [navigate, tg, targetPath]);
};

export default useTelegramBack;