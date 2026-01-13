import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yo'naltirish uchun
import "./premium.scss";
import Nav from "../nav/nav.jsx";
import premiumGif from "../../assets/premium.webp";
import { useTranslation } from 'react-i18next';
import useTelegramBack from "../../hooks/useTelegramBack";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import useGetPremium from "../../hooks/useGetPremium";
import useBuyPremium from "../../hooks/useBuyPremium";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";

const Premium = () => {
  useTelegramBack("/");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  // Ma'lumotlarni hooklardan olish
  const { user, loading: userLoading } = useGetOrCreateUser(tgUser);
  const { premiumOptions = [], loading: plansLoading } = useGetPremium();
  const { buyPremium } = useBuyPremium();

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");

  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const isFormInvalid = !selected || username.trim().length === 0 || userLoading || plansLoading;

  const handleBuyPremium = async () => {
    const selectedPlan = premiumOptions.find((p) => p.id === selected);
    const planPrice = Number(selectedPlan?.price) || 0;
    const userBalance = Number(user?.balance) || 0;

    // 1. Balansni oldindan tekshirish
    if (userBalance < planPrice) {
      setModalOpen(true);
      setModalStatus("error");
      setErrorMessage("insufficient_balance"); // Kalit so'z sifatida saqlaymiz
      return;
    }

    // 2. Modalni ochish va so'rovni boshlash
    setModalOpen(true);
    setModalStatus("loading");
    setErrorMessage("");

    try {
      const payload = {
        user_id: tgUser?.id,
        username: username.replace("@", "").trim(),
        premium_id: selected,
        duration: selectedPlan?.duration,
      };

      // 3. Backend javobini kutish (timeout: 0 bo'lsa cheksiz kutadi)
      await buyPremium(payload);

      // 4. Muvaffaqiyatli yakunlash
      setModalStatus("success");
      
      setTimeout(() => {
        setModalOpen(false);
        setModalStatus("idle");
        setSelected(null);
        setUsername("");
      }, 3000);

    } catch (err) {
      // 5. Xatolik yuz bersa
      setModalStatus("error");
      const msg = err.response?.data?.error || 
                  err.response?.data?.message || 
                  t("error_modal_referal");
      setErrorMessage(msg);
      console.error("Premium purchase error:", err);
    }
  };

  return (
    <>
      <div className="premium">
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
                  <p className="error-text">
                    {errorMessage === "insufficient_balance" ? t("insufficient_balance") : errorMessage}
                  </p>
                  
                  <div className="modal-actions">
                    {errorMessage === "insufficient_balance" ? (
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
            <h2>{t('buyPremium')}</h2>
            <p>{t('premiumSubtitle')}</p>
          </div>
          <div className="right">
            <img src={premiumGif} alt="Premium" width="100px" className="gif-image" />
          </div>
        </header>

        <div className="send">
          <div className="forWho">
            <label htmlFor="name">
              {t('forWho')}
              <a 
                className="for-me-btn"
                onClick={() => setUsername(tgUser?.username || "")}
              >
                {t('forMe')}
              </a>
            </label>
            <input 
              type="text" 
              placeholder={t('enterUsername')} 
              id="name" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="main">
          <div className="premium-container">
            <h3>{t('choosePlan')}</h3>
            
            {plansLoading ? (
              <div className="plans-loader">
                <Loader2 className="spinner animate-spin" size={30} />
              </div>
            ) : (
              <div className="options-list">
                {premiumOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`option-item ${selected === option.id ? "active" : ""}`}
                    onClick={() => setSelected(option.id)}
                  >
                    <div className="radio-circle">
                      {selected === option.id && <div className="inner-dot" />}
                    </div>
                    <div className="premium-info">
                      <span className="amount">
                        {(option.duration || 0)} {t('month')}
                      </span>
                    </div>
                    <div className="price">
                      {(Number(option.price) || 0).toLocaleString()} UZS
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button 
              className="buy-button"
              disabled={isFormInvalid || modalStatus === "loading"}
              onClick={handleBuyPremium}
            >
              {modalStatus === "loading" ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                t('buyPremium')
              )}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Premium;