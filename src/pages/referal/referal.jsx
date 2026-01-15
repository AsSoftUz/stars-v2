import "./referal.scss";
import { useState } from "react";
import { Copy, Share2, Check, Star, Loader2, CheckCircle2, XCircle, Users } from "lucide-react";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/referalGif.mp4";
import { useTranslation } from "react-i18next";
import useTelegramBack from "../../hooks/useTelegramBack";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";
import useBuyGifts from "../../hooks/useBuyGifts";

// Rasmlar importi
// import archa from "../../assets/gifts/archa.webp";
import yurak from "../../assets/gifts/yurak.webp";
import ayiq from "../../assets/gifts/ayiq.webp";
import sovga from "../../assets/gifts/sovga.webp";
import atirgul from "../../assets/gifts/atirgul.webp";
import tort from "../../assets/gifts/tort.webp";
import gullar from "../../assets/gifts/gullar.webp";
import raketa from "../../assets/gifts/raketa.webp";
import kubok from "../../assets/gifts/kubok.webp";
import uzuk from "../../assets/gifts/uzuk.webp";
import olmos from "../../assets/gifts/olmos.webp";
import shanpan from "../../assets/gifts/shanpan.webp";

const Referal = () => {
  useTelegramBack("/");
  const { t } = useTranslation();
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  const { user, loading: userLoading } = useGetOrCreateUser(tgUser);
  const { buyGifts } = useBuyGifts();

  const [activeTab, setActiveTab] = useState("stars");
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [starAmount, setStarAmount] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  // Foydalanuvchi referallari soni (1 ref = 1 Star)
  const referralStars = user?.referral_count || 0;

  const GIFTS_LIST = [
    { id: 1, name: "Yurak", img: yurak, price: 15 },
    { id: 2, name: "Ayiq", img: ayiq, price: 15 },
    { id: 3, name: "Sovga", img: sovga, price: 25 },
    { id: 4, name: "Atirgul", img: atirgul, price: 25 },
    { id: 5, name: "Tort", img: tort, price: 50 },
    { id: 6, name: "Gullar", img: gullar, price: 50 },
    { id: 7, name: "Raketa", img: raketa, price: 50 },
    { id: 8, name: "Kubok", img: kubok, price: 100 },
    { id: 9, name: "Uzuk", img: uzuk, price: 100 },
    { id: 10, name: "Olmos", img: olmos, price: 100 },
    { id: 11, name: "Shanpan", img: shanpan, price: 50 },
  ];

  // VALIDATSIYA MANTIQI
  // Stars uchun: bo'sh bo'lsa, 50 dan kam bo'lsa yoki referallar sonidan ko'p bo'lsa disable bo'ladi
  const isWithdrawDisabled =
    !starAmount ||
    Number(starAmount) < 50 ||
    Number(starAmount) > referralStars;

  // Giftlar uchun: tanlanmagan bo'lsa yoki narxi referallar sonidan ko'p bo'lsa disable bo'ladi
  const isGiftWithdrawDisabled =
    !selectedGift ||
    selectedGift.price > referralStars;

  const handleAction = async (type) => {
    const amountToSpend = type === 'STAR' ? Number(starAmount) : selectedGift.price;

    setModalOpen(true);
    setModalStatus("loading");
    setErrorMsg("");

    try {
      const payload = {
        gift_type: type,
        gift_name: type === 'STAR' ? 'Telegram Stars' : selectedGift.name,
        points_spent: amountToSpend,
        user: user?.id,
      };

      await buyGifts(payload);

      setModalStatus("success");
      setStarAmount("");
      setSelectedGift(null);
      setTimeout(() => setModalOpen(false), 3000);
    } catch (err) {
      setModalStatus("error");
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || t("error_modal_referal"));
    }
  };

  const referralCode = user?.referral_code || "";
  const referralLink = `https://t.me/Abdullayev_Stars_Bot?start=${referralCode}`;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(t("error_copy_referal"), err);
    }
  };

  const handleShare = () => {

    const messageText = `Assalomu alaykum!
Endi siz Visa kartasiz Humo yoki Uzcard yordamida Telegram Stars va Telegram Premium olishingiz mumkin 🥳

Eng muhimi juda arzon narxlarda 🔥`;

    // 2. Linkni shakllantiramiz
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(messageText)}`;

    // 3. Telegram WebApp metodi orqali ochamiz
    if (window.Telegram?.WebApp) {
      // Bu metod telegram ichida ulashish oynasini ochib beradi
      window.Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      // Agar oddiy brauzerda bo'lsa
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <>
      <div className="referal">
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
                  <p className="error-msg">{errorMsg}</p>
                  <button onClick={() => setModalOpen(false)} className="modal-close-btn">{t("close_modal")}</button>
                </div>
              )}
            </div>
          </div>
        )}

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
          <div className="balance-card">
            <div className="balance-item">
              <div className="value">
                <Users width="20px" height="20px" fill="#fff" />
                {userLoading ? "..." : referralStars}
              </div>
              <div className="sub-text">{t("referrals_count")}</div>
            </div>
            <div className="divider"></div>
            <div className="balance-item">
              <div className="value">
                <Star fill="#fff" width="20px" />
                {userLoading ? "..." : referralStars}
              </div>
              <div className="sub-text">{t("balance_referrals") || "Mavjud Stars"}</div>
            </div>
          </div>

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
                    <input
                      type="number"
                      placeholder={t("enterAmount")}
                      value={starAmount}
                      onChange={(e) => setStarAmount(e.target.value)}
                    />
                  </div>
                  <button
                    className={`withdraw-btn ${isWithdrawDisabled ? "disabled" : ""}`}
                    onClick={() => handleAction('STAR')}
                    disabled={isWithdrawDisabled}
                  >
                    {t("withdraw")}
                  </button>
                </div>
                <p className={`min-withdraw ${Number(starAmount) > referralStars ? "error-text" : ""}`}>
                  {Number(starAmount) > referralStars
                    ? t("insufficient_stars") : "min. 50 Stars"}
                </p>
              </div>
            ) : (
              <div className="gifts-content">
                <div className="gifts-grid">
                  {GIFTS_LIST.map((gift) => {
                    const isLocked = gift.price > referralStars;
                    return (
                      <div
                        key={gift.id}
                        className={`gift-box ${selectedGift?.id === gift.id ? "selected" : ""} ${isLocked ? "locked" : ""}`}
                        onClick={() => setSelectedGift(gift)}
                      >
                        <div className="gift-img-wrapper">
                          <img src={gift.img} alt={gift.name} style={{ opacity: isLocked ? 0.4 : 1 }} />
                        </div>
                        <div className="gift-price-tag" style={{ color: isLocked ? "#ff4d4d" : "#fff" }}>
                          <Star fill="#fff" size={16} /> {gift.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="withdraw-section-gift">
                  <button
                    className={`withdraw-btn-gift ${isGiftWithdrawDisabled ? "disabled" : ""}`}
                    disabled={isGiftWithdrawDisabled}
                    onClick={() => handleAction('GIFT')}
                  >
                    {t("withdraw")} {selectedGift && `(${selectedGift.price})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="links-row">
            <div className="link-box">
              <div className="code-value link">t.me/Abdullayev_Stars_Bot?start={referralCode}</div>
              <button onClick={() => handleCopy(referralLink)} className="copy-btn">
                {copiedLink ? <Check size={16} color="#fff" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <button className="share-btn" onClick={handleShare} disabled={userLoading}>
            {userLoading ? <Loader2 className="spin" size={18} /> : <Share2 size={18} />}
            {t("shareOnTelegram")}
          </button>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Referal;