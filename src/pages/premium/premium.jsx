import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./premium.scss";
import Nav from "../nav/nav.jsx";
import premiumGif from "../../assets/premium.webp";

// WebM formatidagi stikerlar/videolar
import success3m from "../../assets/premium3.webm";
import success6m from "../../assets/premium6.webm";
import success12m from "../../assets/premium12.webm";
// import defaultSuccess from "../../assets/success_stars.webm"; 

import confetti from "canvas-confetti";
import { useTranslation } from 'react-i18next';
import { Loader2, XCircle } from "lucide-react";
import useTelegramBack from "../../hooks/useTelegramBack";
import useGetPremium from "../../hooks/useGetPremium";
import useBuyPremium from "../../hooks/useBuyPremium";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";

const Premium = () => {
  useTelegramBack("/");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  const { user, loading: userLoading } = useGetOrCreateUser(tgUser);
  const { premiumOptions = [], loading: plansLoading } = useGetPremium();
  const { buyPremium } = useBuyPremium();

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [purchasedDuration, setPurchasedDuration] = useState(null);

  const isFormInvalid = !selected || username.trim().length === 0 || userLoading || plansLoading;

  // Ikki yondan otiladigan konfetti effekti
  const fireConfetti = () => {
    if (typeof confetti !== 'function') return;

    // 1. SVG'ingizning 'd' atributidagi kodini bu yerga qo'ying
    const premiumPath = 'M5 20v-2h14v2zm0-3.5L3.725 8.475q-.05 0-.113.013T3.5 8.5q-.625 0-1.062-.438T2 7t.438-1.062T3.5 5.5t1.063.438T5 7q0 .175-.038.325t-.087.275L8 9l3.125-4.275q-.275-.2-.45-.525t-.175-.7q0-.625.438-1.063T12 2t1.063.438T13.5 3.5q0 .375-.175.7t-.45.525L16 9l3.125-1.4q-.05-.125-.088-.275T19 7q0-.625.438-1.063T20.5 5.5t1.063.438T22 7t-.437 1.063T20.5 8.5q-.05 0-.112-.012t-.113-.013L19 16.5z';

    // 2. SVG path'dan confetti shaklini yasaymiz
    const premiumShape = confetti.shapeFromPath({ path: premiumPath });

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#248bda', '#ffffff', '#ffd700'];

    const frame = () => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors,
        zIndex: 10000,
        shapes: [premiumShape], // O'zingizning shaklingizni bu yerda ko'rsating
        scalar: 2, // Shakl kichik bo'lsa, bu yerda kattalashtirish mumkin
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors,
        zIndex: 10000,
        shapes: [premiumShape],
        scalar: 2,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    if (modalStatus === "success" && modalOpen) {
      // Modal ochilishi bilan biroz kechikish beramiz (render uchun)
      const timer = setTimeout(() => {
        fireConfetti();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [modalStatus, modalOpen]);

  // Muddatga qarab WebM faylni aniqlash
  const getSuccessWebm = (duration) => {
    switch (Number(duration)) {
      case 3: return success3m;
      case 6: return success6m;
      case 12: return success12m;
      // default: return defaultSuccess;
    }
  };

  const handleBuyPremium = async () => {
    const selectedPlan = premiumOptions.find((p) => p.id === selected);
    const planPrice = Number(selectedPlan?.price) || 0;
    const userBalance = Number(user?.balance) || 0;

    if (userBalance < planPrice) {
      setModalOpen(true);
      setModalStatus("error");
      setErrorMessage("insufficient_balance");
      return;
    }

    setModalOpen(true);
    setModalStatus("loading");

    try {
      const payload = {
        user_id: tgUser?.id,
        username: username.replace("@", "").trim(),
        premium_id: selected,
        duration: selectedPlan?.duration,
      };

      await buyPremium(payload);

      setPurchasedDuration(selectedPlan?.duration);
      setModalStatus("success");
      setTimeout(() => {
        fireConfetti();
      }, 100);

      setTimeout(() => {
        setModalOpen(false);
        setModalStatus("idle");
        setSelected(null);
        setUsername("");
      }, 5000); // Video ko'rinishi uchun vaqt

    } catch (err) {
      console.error(err);
      setModalStatus("error");
      setErrorMessage(err.response?.data?.message || t("error_modal_referal"));
    }
  };

  return (
    <>
      {/* {fireConfetti()} */}
      <div className="premium">
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content celebration-modal">
              {modalStatus === "loading" && (
                <div className="status-box">
                  <Loader2 className="spinner-icon animate-spin" size={60} />
                  <p>{t("sending_modal_referal")}</p>
                </div>
              )}

              {modalStatus === "success" && (
                <div className="status-box congrats-box">
                  {/* WebM Video player - autoplay va muted bilan */}
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="success-video"
                  >
                    <source src={getSuccessWebm(purchasedDuration)} type="video/webm" />
                  </video>
                  <h2 className="congrats-title">{t("congratulations")}!</h2>
                  <p className="congrats-text">
                    <span>{purchasedDuration}</span> {t("month_premium_success")}
                  </p>
                </div>
              )}

              {modalStatus === "error" && (
                <div className="status-box">
                  <XCircle className="error-icon" size={60} />
                  <p className="error-text">
                    {errorMessage === "insufficient_balance" ? t("insufficient_balance") : errorMessage}
                  </p>
                  <div className="modal-actions">
                    <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                      {t("close_modal")}
                    </button>
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
            <img src={premiumGif} alt="Premium" width="140px" />
          </div>
        </header>

        <div className="send">
          <div className="forWho">
            <label htmlFor="name">
              {t('forWho')}
              <button
                type="button"
                className="for-me-btn"
                onClick={() => setUsername(tgUser?.username || "")}
              >
                {t('forMe')}
              </button>
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
              <Loader2 className="animate-spin" size={30} />
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
                      <span className="amount">{option.duration} {t('month')}</span>
                    </div>
                    <div className="price">{Number(option.price).toLocaleString()} UZS</div>
                  </div>
                ))}
              </div>
            )}

            <button
              className="buy-button"
              disabled={isFormInvalid || modalStatus === "loading"}
              onClick={handleBuyPremium}
            >
              {modalStatus === "loading" ? <Loader2 className="animate-spin" size={20} /> : t('buyPremium')}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Premium;