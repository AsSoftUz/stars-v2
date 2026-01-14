import "./settings.scss";
import { useState, useRef, useEffect } from "react";
import premiumImg from "../../assets/premium.png";
import Nav from "../nav/nav.jsx";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../utils/i18n";
import useTelegramBack from "../../hooks/useTelegramBack";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";
import Loader from "../loader/loader";

import {
  Globe,
  CreditCard,
  Headphones,
  Megaphone,
  ChevronDown,
} from "lucide-react";

const languageLabel = {
  uz: "UZB",
  ru: "RUS",
  en: "ENG",
};

const Settings = () => {
  useTelegramBack("/");

  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  // 1. Hook orqali user ma'lumotlarini olamiz
  const { user, loading } = useGetOrCreateUser(tgUser);

  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const containerRef = useRef(null);

  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [payment, setPayment] = useState(() => localStorage.getItem("app_payment") || "Payme");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("app_payment", payment);
  }, [payment]);

  const toggleDropdown = (name) => setOpenDropdown(openDropdown === name ? null : name);
  const handleSelect = (type, value) => {
    if (type === "language") setLanguage(value);
    if (type === "payment") setPayment(value);
    setOpenDropdown(null);
  };

  // 2. Agar ma'lumotlar yuklanayotgan bo'lsa, "Loading..." ko'rsatamiz
  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  // 3. Agar user topilmasa (masalan, API xatosi)
  if (!user) {
    return (
      <div className="settings-error">
        <p>Foydalanuvchi ma'lumotlarini yuklab bo'lmadi.</p>
        <Nav />
      </div>
    );
  }

  return (
    <>
      <div className="settings">
        {/* Header */}
        <header>
          {/* tgUser'dan rasm, agar u bo'lmasa default rasm */}
          <div className="user-avatar">
             <img src={tgUser?.photo_url || premiumImg} alt="User" />
          </div>
          <h2>{user.fullname || "User"}</h2>
          <p>@{user.username || "username"}</p>
        </header>

        {/* Balance */}
        <div className="balance">
          {/* user.balance API'dan keladi */}
          <h2>{Number(user.balance || 0).toLocaleString('ru-RU').replace(/,/g, ' ')} UZS</h2>
          <NavLink to="/topup">{t("top_up_button")}</NavLink>
        </div>

        {/* Settings Container */}
        <div className="settings-container" ref={containerRef}>
          {/* Language Item */}
          <div className="settings-wrapper">
            <div className="settings-item" onClick={() => toggleDropdown("language")}>
              <div className="left-side">
                <span className="icon-wrapper"><Globe size={18} /></span>
                <span className="label">{t("settings_language")}</span>
              </div>
              <div className="right-side">
                <span className="value">{languageLabel[language]}</span>
                <ChevronDown size={14} className={`arrow-icon ${openDropdown === "language" ? "open" : ""}`} />
              </div>
            </div>
            {openDropdown === "language" && (
              <div className="dropdown-menu">
                <div onClick={() => handleSelect("language", "uz")}>UZB</div>
                <div onClick={() => handleSelect("language", "ru")}>RUS</div>
                <div onClick={() => handleSelect("language", "en")}>ENG</div>
              </div>
            )}
          </div>

          {/* Payment Item */}
          {/* <div className="settings-wrapper">
            <div className="settings-item" onClick={() => toggleDropdown("payment")}>
              <div className="left-side">
                <span className="icon-wrapper"><CreditCard size={18} /></span>
                <span className="label">{t("settings_payment")}</span>
              </div>
              <div className="right-side">
                <span className="value">{payment}</span>
                <ChevronDown size={14} className={`arrow-icon ${openDropdown === "payment" ? "open" : ""}`} />
              </div>
            </div>
            {openDropdown === "payment" && (
              <div className="dropdown-menu">
                <div onClick={() => handleSelect("payment", "Payme")}>Payme</div>
                <div onClick={() => handleSelect("payment", "Click")}>Click</div>
              </div>
            )}
          </div> */}

          {/* Support and News */}
          <a className="settings-item" href="https://t.me/Coder_Abdullayev" target="_blank" rel="noreferrer">
            <div className="left-side">
              <span className="icon-wrapper"><Headphones size={18} /></span>
              <span className="label">{t("settings_help")}</span>
            </div>
            <div className="right-side"><span className="value">@Coder_Abdullayev</span></div>
          </a>

          <a className="settings-item" href="https://t.me/Abdullayev_Stars" target="_blank" rel="noreferrer">
            <div className="left-side">
              <span className="icon-wrapper"><Megaphone size={18} /></span>
              <span className="label">{t("settings_news")}</span>
            </div>
            <div className="right-side"><span className="value">@Abdullayev_Stars</span></div>
          </a>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Settings;