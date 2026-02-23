import "./home.scss";
import { useEffect, useState } from "react";
import duck from "../../assets/duck.gif";
import starsImg from "../../assets/stars.png";
import premiumImg from "../../assets/premium.png";
import Nav from "../nav/nav.jsx";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Loader from "../loader/loader";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";
import { X, Bell } from "lucide-react";
import TechIssues from '../techIssues/techIssues';
import i18n from "../../utils/i18n";

const Home = () => {
  const { t } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [tech, setTech] = useState(false);

  // 1. Animatsiya holatini tekshirish
  const [isAnimationDone, setIsAnimationDone] = useState(() => {
    return localStorage.getItem("home_loader_finished") === "true";
  });

  // 2. Til tanlash modali (Keshda til bo'lmasa ko'rsatiladi)
  const [showLanguageModal, setShowLanguageModal] = useState(() => {
    return !localStorage.getItem("language"); 
  });

  const tg = window.Telegram?.WebApp;
  const { user, loading, isTelegram } = useGetOrCreateUser();

  // Telegramdan tashqarida ochilsa redirect
  useEffect(() => {
    if (window.Telegram && !window.Telegram.WebApp.initData) {
      window.location.href = "https://google.com";
    }
  }, []);

  // Til tanlash va keshga saqlash
  const handleLanguageSelect = (lang) => {
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
    setShowLanguageModal(false);
    
    // Til tanlangandan keyin Welcome modalni tekshirish
    const hasVisited = localStorage.getItem("has_visited_linkify");
    if (!hasVisited && !loading && isAnimationDone) {
      setShowWelcome(true);
      localStorage.setItem("has_visited_linkify", "true");
    }
  };

  // Welcome modalni avtomatik chiqarish (useEffect orqali)
  useEffect(() => {
    const hasVisited = localStorage.getItem("has_visited_linkify");
    if (!hasVisited && !loading && isAnimationDone && isTelegram && !showLanguageModal) {
      setShowWelcome(true);
      localStorage.setItem("has_visited_linkify", "true");
    }
  }, [loading, isAnimationDone, isTelegram, showLanguageModal]);

  // Telegram Mini App emasligi aniqlansa
  if (!isTelegram) {
    return (
      <div className="browser-error">
        <h2>{t("please_open_in_telegram") || "Iltimos, botni Telegram orqali oching!"}</h2>
      </div>
    );
  }

  const handleJoinChannel = () => {
    const channelLink = "https://t.me/Abdullayev_Stars";
    if (tg) {
      tg.openTelegramLink(channelLink);
    } else {
      window.open(channelLink, "_blank");
    }
    setShowWelcome(false);
  };

  const handleAnimationFinished = () => {
    setIsAnimationDone(true);
    localStorage.setItem("home_loader_finished", "true");
  };

  // Loader (Animatsiya bitmagan bo'lsa ko'rsatiladi)
  if (!isAnimationDone) {
    return <Loader onFinished={handleAnimationFinished} />;
  }

  if (tech) {
    return <TechIssues />;
  }

  return (
    <>
      <div className="home">
        {/* TIL TANLASH MODALI */}
        {showLanguageModal && (
          <div className="welcome-modal-overlay language-modal">
            <div className="welcome-modal-content">
              <h3>Choose Language / Tilni tanlang / Выберите язык</h3>
              <p>Iltimos, ilova tilini tanlang:</p>
              
              <div className="language-options">
                <button onClick={() => handleLanguageSelect("uz")}>
                  O'zbekcha <img src="https://flagcdn.com/w40/uz.png" width="24" alt="UZ" />
                </button>
                <button onClick={() => handleLanguageSelect("ru")}>
                  Русский <img src="https://flagcdn.com/w40/ru.png" width="24" alt="RU" />
                </button>
                <button onClick={() => handleLanguageSelect("en")}>
                  English <img src="https://flagcdn.com/w40/us.png" width="24" alt="EN" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WELCOME MODAL */}
        {!showLanguageModal && showWelcome && (
          <div className="welcome-modal-overlay">
            <div className="welcome-modal-content">
              <button className="close-x" onClick={() => setShowWelcome(false)}>
                <X size={20} />
              </button>
              <div className="icon-wrapper">
                <Bell size={40} color="#0088cc" fill="#0088cc22" />
              </div>
              <h3>{t("welcome_modal_title")}</h3>
              <p>{t("welcome_modal_text")}</p>
              <button className="join-btn" onClick={handleJoinChannel}>
                {t("join_channel_btn")}
              </button>
            </div>
          </div>
        )}

        <div className="hero">
          <h1>
            {t("welcome")}
            <img src={duck} alt="" width="44px" />
          </h1>
        </div>

        <div className="main-cards">
          <div className="pcard">
            <div className="card">
              <div className="left">
                <h2>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 30">
                    <path d="M25.326 10.137a1.001 1.001 0 0 0-.807-.68l-7.34-1.066l-3.283-6.651c-.337-.683-1.456-.683-1.793 0L8.82 8.391L1.48 9.457a1 1 0 0 0-.554 1.705l5.312 5.178l-1.254 7.31a1.001 1.001 0 0 0 1.451 1.054L13 21.252l6.564 3.451a1 1 0 0 0 1.451-1.054l-1.254-7.31l5.312-5.178a.998.998 0 0 0 .253-1.024z" />
                  </svg>
                  {t("stars")}
                </h2>
                <p>{t("starsSubtitle")}</p>
              </div>
              <div className="right">
                <img src={starsImg} alt="" />
              </div>
            </div>
            <NavLink to="/stars">{t("buyStars")}</NavLink>
          </div>

          <div className="pcard">
            <div className="card">
              <div className="left">
                <h2>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M5 20v-2h14v2zm0-3.5L3.725 8.475q-.05 0-.113.013T3.5 8.5q-.625 0-1.062-.438T2 7t.438-1.062T3.5 5.5t1.063.438T5 7q0 .175-.038.325t-.087.275L8 9l3.125-4.275q-.275-.2-.45-.525t-.175-.7q0-.625.438-1.063T12 2t1.063.438T13.5 3.5q0 .375-.175.7t-.45.525L16 9l3.125-1.4q-.05-.125-.088-.275T19 7q0-.625.438-1.063T20.5 5.5t1.063.438T22 7t-.437 1.063T20.5 8.5q-.05 0-.112-.012t-.113-.013L19 16.5z" />
                  </svg>
                  {t("premium")}
                </h2>
                <p>{t("premiumSubtitle")}</p>
              </div>
              <div className="right">
                <img src={premiumImg} alt="" />
              </div>
            </div>
            <NavLink to="/premium">{t("buyPremium")}</NavLink>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Home;