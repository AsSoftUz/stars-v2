import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yo'naltirish uchun
import "./stars.scss";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/starsGif.mp4";
import { useTranslation } from 'react-i18next';
import useTelegramBack from "../../hooks/useTelegramBack";
import { ChevronUp, ChevronDown, Loader2, CheckCircle2, XCircle } from "lucide-react";
import useGetStars from "../../hooks/useGetStars";
import useBuyStars from "../../hooks/useBuyStars";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";

const Stars = () => {
  useTelegramBack("/");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  // Ma'lumotlarni hooklardan olish
  const { user, loading: userLoading } = useGetOrCreateUser(tgUser);
  const { starsOptions = [], loading: starsLoading } = useGetStars();
  const { buyStars } = useBuyStars();

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [showAll, setShowAll] = useState(false);
  
  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle"); // idle, loading, success, error
  const [buyError, setBuyError] = useState(null);

  const getStarLayers = (count) => {
    const num = Number(count) || 0;
    if (num >= 2500) return 5;
    if (num >= 1000) return 4;
    if (num >= 250) return 3;
    return 2;
  };

  const safeStarsOptions = Array.isArray(starsOptions) ? starsOptions : [];
  const visibleOptions = showAll ? safeStarsOptions : safeStarsOptions.slice(0, 3);
  
  const isFormInvalid = !selected || username.trim().length === 0 || userLoading || starsLoading;

  const handleBuyStars = async () => {
    const selectedPackage = safeStarsOptions.find(p => p.id === selected);
    const planPrice = Number(selectedPackage?.price) || 0;
    const userBalance = Number(user?.balance) || 0;

    // 1. Balans tekshiruvi
    if (userBalance < planPrice) {
      setModalOpen(true);
      setModalStatus("error");
      setBuyError("insufficient_balance"); // Til kalitini saqlaymiz
      return;
    }

    setModalOpen(true);
    setModalStatus("loading");
    setBuyError(null);

    try {
      const payload = {
        user_id: tgUser?.id,
        username: username.replace("@", "").trim(),
        amount: Number(selectedPackage?.stars_count) || 0
      };

      // 2. So'rovni yuborish (timeout: 0 bo'lgani uchun javobni kutadi)
      await buyStars(payload);

      setModalStatus("success");
      
      setTimeout(() => {
        setModalOpen(false);
        setModalStatus("idle");
        setSelected(null);
        setUsername("");
      }, 3000);

    } catch (err) {
      setModalStatus("error");
      const errorMsg = err.response?.data?.error ||
        err.response?.data?.message ||
        t("error_modal_stars2");
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
                  <Loader2 className="spinner-icon animate-spin" size={60} />
                  <p>{t("sending_modal_referal")}</p>
                </div>
              )}

              {modalStatus === "success" && (
                <div className="status-box">
                  <CheckCircle2 className="success-icon animate-tick" size={60} />
                  <p>{t("success_modal_referal")}</p>
                </div>
              )}

              {modalStatus === "error" && (
                <div className="status-box">
                  <XCircle className="error-icon" size={60} />
                  <p className="error-msg">
                    {buyError === "insufficient_balance" ? t("insufficient_balance") : buyError}
                  </p>
                  
                  <div className="modal-actions">
                    {buyError === "insufficient_balance" ? (
                      <button 
                        onClick={() => navigate("/topup")} 
                        className="modal-topup-btn"
                      >
                        {t("topup_balance") || "Hisobni to'ldirish"}
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setModalOpen(false); setModalStatus("idle"); }} 
                        className="modal-close-btn"
                      >
                        {t("close_modal")}
                      </button>
                    )}
                  </div>
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
            <label>
              {t("stars_forWho")}
              <button className="for-me-btn" onClick={() => setUsername(tgUser?.username || "")}>
                {t("forMe")}
              </button>
            </label>
            <input
              type="text"
              placeholder={t("enterUsername")}
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
                <Loader2 className="spinner animate-spin" size={30} />
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
                        {[...Array(getStarLayers(option.stars_count))].map((_, i) => (
                          <i key={i} className="star-icon"></i>
                        ))}
                      </div>
                      <span className="amount">
                        {(Number(option.stars_count) || 0).toLocaleString()} Stars
                      </span>
                    </div>
                    <div className="price">{(Number(option.price) || 0).toLocaleString()} UZS</div>
                  </div>
                ))}
              </div>
            )}

            {safeStarsOptions.length > 3 && (
              <button className="show-more" onClick={() => setShowAll(!showAll)}>
                {showAll ? t("stars_showLess") : t("stars_showMore")}
                {showAll ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}

            <button
              className="buy-button"
              disabled={isFormInvalid || modalStatus === "loading"}
              onClick={handleBuyStars}
            >
              {modalStatus === "loading" ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                t("stars_buyButton")
              )}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Stars;