import "./referal.scss";
import { useState } from "react";
import { Copy, Share2, Check, Star, Loader2 } from "lucide-react";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/referalGif.mp4";
import { useTranslation } from "react-i18next";
import useTelegramBack from "../../hooks/useTelegramBack";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";

const Referal = () => {
  useTelegramBack("/");
  const { t } = useTranslation();
  
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  // 1. Hook orqali user ma'lumotlarini olamiz
  const { user, loading } = useGetOrCreateUser(tgUser);

  const [activeTab, setActiveTab] = useState("stars");
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dinamik ma'lumotlar
  const referralCode = user?.referral_code || "Yuklanmoqda...";
  const botUsername = "Linkify_tgbot"; // Bot usernamesi
  const referralLink = `https://t.me/${botUsername}?start=${referralCode}`;

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "id") {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (err) {
      console.error("Nusxa ko‘chirib bo‘lmadi", err);
    }
  };

  const handleShare = () => {
    const text = encodeURIComponent("Men bilan birga Telegram Stars ishlang! 🌟");
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <>
      <div className="referal">
        <header>
          <div className="left">
            <h2>{t("referalTitle")}</h2>
            <p>{t("referalSubtitle")}</p>
          </div>
          <div className="right">
            <video autoPlay muted loop playsInline className="gif-video">
              <source src={headerImg} type="video/mp4" />
            </video>
          </div>
        </header>

        <div className="referral-page">
          {/* Balans va Statistika */}
          <div className="balance-card">
            <div className="balance-item">
              <div className="value">
                <Star fill="#fff" width="20px" /> 
                {loading ? "..." : (user?.referral_count || 0)}
              </div>
              <div className="sub-text">{t("referal_count")}</div>
            </div>
            <div className="divider"></div>
            <div className="balance-item">
              <div className="value">
                <Star fill="#fff" width="20px" /> 
                {loading ? "..." : (Number(user?.balance) || 0).toLocaleString()} UZS
              </div>
              <div className="sub-text">{t("totalBalance")}</div>
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="withdraw-card">
            <div className="tab-buttons">
              <button className={activeTab === "stars" ? "active" : ""} onClick={() => setActiveTab("stars")}>
                {t("stars")}
              </button>
              <button className={activeTab === "gifts" ? "active" : ""} onClick={() => setActiveTab("gifts")}>
                {t("gifts")}
              </button>
            </div>

            {activeTab === "stars" ? (
              <div className="stars-content">
                <div className="input-row">
                  <div className="input-wrapper">
                    <span className="input-icon"><Star fill="#fff" width="20px" /></span>
                    <input type="number" placeholder={t("enterAmount")} />
                  </div>
                  <button className="withdraw-btn">{t("withdraw")}</button>
                </div>
                <p className="min-withdraw">{t("minWithdrawInfo")}</p>
              </div>
            ) : (
              <div className="gifts-content">
                <div className="gifts-grid">
                  {[...Array(8)].map((_, i) => <div key={i} className="gift-box"></div>)}
                </div>
                <p className="min-withdraw">{t("GiftsReminder")}</p>
              </div>
            )}
          </div>

          {/* Dinamik Linklar qismi */}
          <div className="links-row">
            {/* <div className="link-box">
              <span>Referral Link</span>
              <button
                onClick={() => handleCopy(referralLink, "link")}
                className="copy-btn"
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink && <span className="tooltip">{t("copied")}</span>}
              </button>
            </div> */}
            
            <div className="link-box">
              {/* <div className="label-text">Referral Link</div> */}
              <div className="code-value link">{loading ? "..." : referralLink}</div>
              <button onClick={() => handleCopy(referralLink, "link")} className="copy-btn">
                {copiedLink ? <Check size={16} color="#4caf50" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <button className="share-btn" onClick={handleShare} disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : <Share2 size={18} />}
            {t("shareOnTelegram")}
          </button>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Referal;