import { useState } from "react";
import "./stars.scss";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/starsGif.mp4";
import { useTranslation } from 'react-i18next';
import useTelegramBack from "../../hooks/useTelegramBack";
import { ChevronUp, ChevronDown, Loader2, CheckCircle2, XCircle } from "lucide-react";
import useGetStars from "../../hooks/useGetStars"; 
import api from "../../api/axios";

const Stars = () => {
  useTelegramBack("/");
  const { t } = useTranslation();

  // Telegram WebApp ma'lumotlari
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  // 1. Paketlarni yuklab olish
  const { starsOptions = [], loading: starsLoading } = useGetStars();

  // 2. Local State
  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Modal va Buy mantiqi uchun state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("loading"); // loading, success, error
  const [buyError, setBuyError] = useState(null);

  // Star qavatlarini aniqlash (vizual stack uchun)
  const getStarLayers = (amount) => {
    const num = Number(amount) || 0;
    if (num >= 2500) return 5;
    if (num >= 1000) return 4;
    if (num >= 250) return 3;
    return 2;
  };

  const isFormInvalid = !selected || username.trim().length === 0;
  
  // Ma'lumotlar massiv ekanligiga ishonch hosil qilamiz
  const safeStarsOptions = Array.isArray(starsOptions) ? starsOptions : [];
  const visibleOptions = showAll ? safeStarsOptions : safeStarsOptions.slice(0, 3);

  // 3. Sotib olish funksiyasi (useBuyStars hooki o'rnida)
  const handleBuyStars = async () => {
    setModalOpen(true);
    setModalStatus("loading");
    setBuyError(null);

    try {
      const selectedPackage = safeStarsOptions.find(p => p.id === selected);
      
      const payload = {
        telegram_id: tgUser?.id,
        target_username: username.replace("@", "").trim(),
        star_id: selected,
        amount: Number(selectedPackage?.amount) || 0
      };

      await api.post("/stars-buy/", payload);
      
      setModalStatus("success");
      
      // Muvaffaqiyatli bo'lsa 3 soniyadan keyin modal yopiladi
      setTimeout(() => {
        setModalOpen(false);
      }, 3000);

    } catch (err) {
      setModalStatus("error");
      // Serverdan kelgan xatolik xabarini olish
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || "Sotib olishda xatolik yuz berdi";
      setBuyError(errorMsg);
    }
  };

  return (
    <>
      <div className="stars">
        {/* --- MODAL SECTION --- */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {modalStatus === "loading" && (
                <div className="status-box">
                  <Loader2 className="spinner-icon" size={60} />
                  <p>So'rov yuborilmoqda...</p>
                </div>
              )}

              {modalStatus === "success" && (
                <div className="status-box">
                  <CheckCircle2 className="success-icon animate-tick" size={60} />
                  <p>Muvaffaqiyatli sotib olindi!</p>
                </div>
              )}

              {modalStatus === "error" && (
                <div className="status-box">
                  <XCircle className="error-icon" size={60} />
                  <p className="error-msg">{buyError}</p>
                  <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                    Yopish
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <header>
          <div className="left">
            <h2>{t("stars_title")}</h2>
            <p>{t("stars_subtitle")}</p>
          </div>
          <div className="right">
            <video autoPlay muted loop playsInline className="gif-video">
              <source src={headerImg} type="video/mp4" />
            </video>
          </div>
        </header>

        <div className="send">
          <div className="forWho">
            <label htmlFor="name">
              {t("stars_forWho")}
              <a
                href="#"
                className="for-me-link"
                onClick={(e) => {
                  e.preventDefault();
                  setUsername(tgUser?.username || "");
                }}
              >
                {t("forMe")}
              </a>
            </label>
            <input
              type="text"
              placeholder={t("enterUsername")}
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="main">
          <div className="stars-container">
            <h3>{t("stars_packages")}</h3>
            
            {starsLoading ? (
              <div className="stars-loader">
                <Loader2 className="spinner" size={30} />
              </div>
            ) : (
              <div className="options-list">
                {visibleOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`option-item ${selected === option.id ? "active" : ""}`}
                    onClick={() => setSelected(option.id)}
                  >
                    <div className="radio-circle">
                      {selected === option.id && <div className="inner-dot" />}
                    </div>

                    <div className="stars-info">
                      <div className="stars-stack">
                        {[...Array(getStarLayers(option.amount))].map((_, i) => (
                          <i key={i} className="star-icon"></i>
                        ))}
                      </div>
                      <span className="amount">
                        {(Number(option.amount) || 0).toLocaleString()} Stars
                      </span>
                    </div>

                    <div className="price">
                      {(Number(option.price) || 0).toLocaleString()} UZS
                    </div>
                  </div>
                ))}
              </div>
            )}

            {safeStarsOptions.length > 3 && (
              <button className="show-more" onClick={() => setShowAll(!showAll)}>
                {showAll ? (
                  <div className="btn-content">
                    {t("stars_showLess")} <ChevronUp size={18} />
                  </div>
                ) : (
                  <div className="btn-content">
                    {t("stars_showMore")} <ChevronDown size={18} />
                  </div>
                )}
              </button>
            )}

            <button 
              className="buy-button" 
              disabled={isFormInvalid || starsLoading}
              onClick={handleBuyStars}
            >
              {t("stars_buyButton")}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Stars;