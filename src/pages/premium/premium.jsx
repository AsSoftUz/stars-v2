import { useState } from "react";
import "./premium.scss";
import Nav from "../nav/nav.jsx";
import premiumGif from "../../assets/premium.gif";
import { useTranslation } from 'react-i18next';
import useTelegramBack from "../../hooks/useTelegramBack";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import useGetPremium from "../../hooks/useGetPremium";
import useBuyPremium from "../../hooks/useBuyPremium";

const Premium = () => {
  useTelegramBack("/");
  const { t } = useTranslation();

  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  // Premium paketlarni olish
  const { premiumOptions = [], loading: plansLoading } = useGetPremium();

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");

  // Modal holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const isFormInvalid = !selected || username.trim().length === 0;

  const { buyPremium } = useBuyPremium();

  const handleBuyPremium = async () => {
    setModalOpen(true);
    setModalStatus("loading");
    setErrorMessage("");

    try {
      const selectedPlan = premiumOptions.find((p) => p.id === selected);

      await buyPremium({
        user_id: tgUser?.id,
        username: username.replace("@", "").trim(),
        premium_id: selected,
        duration: selectedPlan?.duration,
      });

      setModalStatus("success");
      setTimeout(() => {
        setModalOpen(false);
      }, 3000);
    } catch (err) {
      setModalStatus("error");
      setErrorMessage(
        err.response?.data?.error || t("error_modal_referal")
      );
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
                  <Loader2 className="spinner-icon" size={60} />
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
                  <p className="error-text">{errorMessage}</p>
                  <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                    {t("close_modal")}
                  </button>
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
            <img src={premiumGif} alt="Premium" width="100px" className="gif-video" />
          </div>
        </header>

        <div className="send">
          <div className="forWho">
            <label htmlFor="name">
              {t('forWho')}
              <a 
                href="#" 
                className="for-me-link"
                onClick={(e) => { 
                  e.preventDefault(); 
                  setUsername(tgUser?.username || ""); 
                }}
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
                <Loader2 className="spinner" size={30} />
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
              disabled={isFormInvalid || plansLoading}
              onClick={handleBuyPremium}
            >
              {t('buyPremium')}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Premium;