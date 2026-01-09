import "./referal.scss";
import { useState } from "react";
import { Copy, Share2, Check, Star } from "lucide-react";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/referalGif.mp4";
// import headerImg from "./gif.webm";
import { useTranslation } from "react-i18next";
import useTelegramBack from "../../hooks/useTelegramBack";

const Referal = () => {
    useTelegramBack("/");
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("stars"); // 'stars' yoki 'gifts'
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralId = "stares216565462";
  const referralLink = "https://t.me/starte?start=123";

  // Nusxa ko'chirish funksiyasi
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

  // Telegramda ulashish funksiyasi
  const handleShare = () => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referralLink
    )}&text=${encodeURIComponent("Men bilan birga Telegram Stars ishlang!")}`;
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
            <video type="video/webm" autoPlay muted loop playsInline className="gif-video">
              <source src={headerImg}  type="video/webm" />
              Sizning brauzeringiz videoni qo'llab-quvvatlamaydi.
            </video>
          </div>
        </header>

        <div className="referral-page">
          {/* Balans qismi */}
          <div className="balance-card">
            <div className="balance-item">
              <div className="value">
                <Star fill="#fff" width="20px" /> 0 = 0 UZS
              </div>
              <div className="sub-text">{t("readyTobuy")}</div>
            </div>
            <div className="divider"></div>
            <div className="balance-item">
              <div className="value">
                <Star fill="#fff" width="20px" /> 0 = 0 UZS
              </div>
              <div className="sub-text">{t("totalBalance")}</div>
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="withdraw-card">
            <div className="tab-buttons">
              <button
                className={activeTab === "stars" ? "active" : ""}
                onClick={() => setActiveTab("stars")}
              >
                {t("stars")}
              </button>
              <button
                className={activeTab === "gifts" ? "active" : ""}
                onClick={() => setActiveTab("gifts")}
              >
                {t("gifts")}
              </button>
            </div>

            {activeTab === "stars" ? (
              <div className="stars-content">
                <form className="input-row">
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <Star fill="#fff" width="20px" />
                    </span>
                    <input type="number" placeholder={t("enterAmount")} />
                  </div>
                  <button className="withdraw-btn">{t("withdraw")}</button>
                </form>
                <p className="min-withdraw">{t("minWithdrawInfo")}</p>
              </div>
            ) : (
              <div className="gifts-content">
                <div className="gifts-grid">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="gift-box"></div>
                  ))}
                </div>
                <p className="min-withdraw">{t("GiftsReminder")}</p>
              </div>
            )}
          </div>

          {/* Copy & Share Section */}
          <div className="links-row">
            <div className="link-box">
              <span>Referral Link</span>
              <button
                onClick={() => handleCopy(referralLink, "link")}
                className="copy-btn"
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink && <span className="tooltip">{t("copied")}</span>}
              </button>
            </div>
          </div>

          <button className="share-btn" onClick={handleShare}>
            <Share2 size={18} /> {t("shareOnTelegram")}
          </button>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Referal;
