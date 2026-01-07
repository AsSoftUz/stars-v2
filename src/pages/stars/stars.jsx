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

  // Telegram ma'lumotlari
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  // Backenddan paketlarni olish
  const { starsOptions, loading: starsLoading } = useGetStars();

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("loading"); // loading, success, error

  const getStarLayers = (amount) => {
    if (amount >= 2500) return 5;
    if (amount >= 1000) return 4;
    if (amount >= 250) return 3;
    return 2;
  };

  const isFormInvalid = !selected || username.trim().length === 0;
  const visibleOptions = showAll ? starsOptions : starsOptions.slice(0, 3);

  // SOTIB OLISH FUNKSIYASI
  const handleBuyStars = async () => {
    setModalOpen(true);
    setModalStatus("loading");

    try {
      const selectedPackage = starsOptions.find(p => p.id === selected);

      await api.post("/orders/", {
        telegram_id: tgUser?.id,
        target_username: username,
        star_id: selected,
        amount: selectedPackage.amount
      });

      setModalStatus("success");
      setTimeout(() => {
        setModalOpen(false);
        // Xohlasangiz bu yerda userni settingsga o'tkazish mumkin: navigate("/settings")
      }, 3000);
    } catch (err) {
      setModalStatus("error");
    }
  };

  return (
    <>
      <div className="stars">
        {/* INLINE MODAL PART */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {modalStatus === "loading" && (
                <div className="status-box">
                  <Loader2 className="spinner-icon" size={60} />
                  <p>Buyurtma berilmoqda...</p>
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
                  <p>Xatolik yuz berdi!</p>
                  <button onClick={() => setModalOpen(false)} className="modal-close-btn">Yopish</button>
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
                <Loader2 className="spinner" />
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
                      <span className="amount">{option.amount.toLocaleString()} Stars</span>
                    </div>
                    <div className="price">{Number(option.price).toLocaleString()} UZS</div>
                  </div>
                ))}
              </div>
            )}

            {starsOptions.length > 3 && (
              <button className="show-more" onClick={() => setShowAll(!showAll)}>
                {showAll ? (
                  <>{t("stars_showLess")} <ChevronUp size={18} /></>
                ) : (
                  <>{t("stars_showMore")} <ChevronDown size={18} /></>
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