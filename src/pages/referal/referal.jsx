import "./referal.scss";
import { useState } from "react";
import { Copy, Share2, Check, Star, Loader2, CheckCircle2, XCircle, Users } from "lucide-react";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/referalGif.mp4";
import { useTranslation } from "react-i18next";
import useTelegramBack from "../../hooks/useTelegramBack";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";
import useBuyGifts from "../../hooks/useBuyGifts";
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

  const referralStars = user?.referral_count || 0;
  const bonusPoints = user?.bonus_points || 0;


  // --- YORDAMCHI FUNKSIYALAR ---
  const formatNumber = (val) => val ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "";
  const deformatNumber = (val) => val.replace(/\s/g, "");

  const triggerVibro = (type = 'light') => {
    if (type === 'success' || type === 'error') {
      tg?.HapticFeedback.notificationOccurred(type);
    } else {
      tg?.HapticFeedback.impactOccurred(type);
    }
  };

  const isWithdrawDisabled = !starAmount || Number(starAmount) < 50 || Number(starAmount) > bonusPoints;
  const isGiftWithdrawDisabled = !selectedGift || selectedGift.price > bonusPoints;

  const handleAction = async (type) => {
    const amountToSpend = type === 'STAR' ? Number(starAmount) : selectedGift.price;
    triggerVibro('medium');
    setModalOpen(true);
    setModalStatus("loading");
    setErrorMsg("");

    try {
      const payload = {
        gift_type: type,
        gift_name: type === 'STAR' ? 'Telegram Stars' : selectedGift.name,
        points_spent: amountToSpend,
        // user: tgUser?.id --> OLIB TASHLANDI (Xavfsizlik uchun)
      };

      await buyGifts(payload);

      triggerVibro('success');
      setModalStatus("success");
      setStarAmount("");
      setSelectedGift(null);

      // Ma'lumotlarni yangilash (balance kamayganini ko'rsatish uchun)
      if (userLoading === false && typeof user !== 'undefined') {
        // Agar hookda refetch bo'lsa, shu yerda chaqiring
      }

      setTimeout(() => setModalOpen(false), 3000);
    } catch (err) {
      triggerVibro('error');
      setModalStatus("error");
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || t("error_modal_referal"));
    }
  };

  const referralCode = user?.referral_code || "";
  const referralLink = `https://t.me/Abdullayev_Stars_Bot?start=${referralCode}`;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      triggerVibro('success');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(t("error_copy_referal"), err);
    }
  };

  const handleShare = () => {
    triggerVibro();
    const messageText = `Assalomu alaykum!\nEndi siz Visa kartasiz Humo yoki Uzcard yordamida Telegram Stars va Telegram Premium olishingiz mumkin 🥳\n\nEng muhimi juda arzon narxlarda 🔥`;

    // Telegram Share URL formati
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(messageText)}`;

    if (tg) {
      tg.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, "_blank");
    }
  };

  return (
    <>
      <div className="referal">
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {modalStatus === "loading" && <div className="status-box"><Loader2 className="spinner-icon animate-spin" size={60} /><p>{t("sending_modal_referal")}</p></div>}
              {modalStatus === "success" && <div className="status-box"><CheckCircle2 className="success-icon animate-tick" size={60} /><p>{t("success_modal_referal")}</p></div>}
              {modalStatus === "error" && <div className="status-box"><XCircle className="error-icon" size={60} /><p className="error-msg">{errorMsg}</p><button onClick={() => setModalOpen(false)} className="modal-close-btn">{t("close_modal")}</button></div>}
            </div>
          </div>
        )}

        <header>
          <div className="left"><h2>{t("referalTitle")}</h2><p>{t("referalSubtitle")}</p></div>
          <div className="right"><video autoPlay muted loop playsInline className="gif-video"><source src={headerImg} type="video/mp4" /></video></div>
        </header>

        <div className="referral-page">
          <div className="balance-card">
            <div className="balance-item">
              <div className="value"><Users width="20px" height="20px" fill="#fff" />{userLoading ? "..." : referralStars}</div>
              <div className="sub-text">{t("referrals_count")}</div>
            </div>
            <div className="divider"></div>
            <div className="balance-item">
              <div className="value"><Star fill="#fff" width="20px" />{userLoading ? "..." : bonusPoints}</div>
              <div className="sub-text">{t("balance_referrals") || "Mavjud Stars"}</div>
            </div>
          </div>

          <div className="withdraw-card">
            <div className="tab-buttons">
              <button className={activeTab === "stars" ? "active" : ""} onClick={() => { triggerVibro(); setActiveTab("stars"); }}>{t("stars")}</button>
              <button className={activeTab === "gifts" ? "active" : ""} onClick={() => { triggerVibro(); setActiveTab("gifts"); }}>{t("gifts")}</button>
            </div>

            {activeTab === "stars" ? (
              <div className="stars-content">
                <div className="input-row">
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <img src="data:image/svg+xml,%3Csvg height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6.02 4.99 2.21-4.42c.25-.51.86-.72 1.37-.46.2.1.36.27.46.47l2.08 4.26c.17.34.5.58.88.63l4.36.52c.59.08 1.02.62.95 1.22-.03.24-.14.47-.32.65l-3.45 3.42c-.14.13-.2.33-.18.53l.57 4.61c.09.66-.38 1.27-1.03 1.35-.25.03-.5-.02-.72-.14l-3.64-2c-.26-.14-.58-.15-.85-.01l-3.77 1.95c-.53.27-1.18.06-1.45-.48-.11-.2-.14-.43-.11-.65l.3-2.12c.15-1.04.79-1.93 1.71-2.41l4.19-2.15c.11-.06.15-.2.1-.31-.05-.09-.14-.14-.24-.12l-5.12.74c-.78.11-1.58-.11-2.19-.62l-1.71-1.4c-.49-.4-.56-1.12-.17-1.62.19-.22.45-.37.74-.41l4.38-.57c.28-.03.52-.21.65-.46z' fill='%23ffb222' /%3E%3C/svg%3E" alt="" width={20} />
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={t("enterAmount")}
                      value={formatNumber(starAmount)}
                      onChange={(e) => {
                        const raw = deformatNumber(e.target.value);
                        if (/^\d*$/.test(raw)) {
                          setStarAmount(raw);
                          tg?.HapticFeedback.selectionChanged();
                        }
                      }}
                    />
                  </div>
                  <button className={`withdraw-btn ${isWithdrawDisabled ? "disabled" : ""}`} onClick={() => handleAction('STAR')} disabled={isWithdrawDisabled}>{t("withdraw")}</button>
                </div>
                <p className={`min-withdraw ${Number(starAmount) > bonusPoints ? "error-text" : ""}`}>
                  {Number(starAmount) > bonusPoints ? t("insufficient_stars") : "min. 50 Stars"}
                </p>
              </div>
            ) : (
              <div className="gifts-content">
                <div className="gifts-grid">
                  {GIFTS_LIST.map((gift) => {
                    const isLocked = gift.price > bonusPoints;
                    return (
                      <div key={gift.id} className={`gift-box ${selectedGift?.id === gift.id ? "selected" : ""} ${isLocked ? "locked" : ""}`} onClick={() => { if (!isLocked) triggerVibro(); setSelectedGift(gift); }}>
                        <div className="gift-img-wrapper"><img src={gift.img} alt={gift.name} style={{ opacity: isLocked ? 0.4 : 1 }} /></div>
                        <div className="gift-price-tag" style={{ color: isLocked ? "#ff4d4d" : "var(--text-main)" }}>
                          <img src="data:image/svg+xml,%3Csvg height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6.02 4.99 2.21-4.42c.25-.51.86-.72 1.37-.46.2.1.36.27.46.47l2.08 4.26c.17.34.5.58.88.63l4.36.52c.59.08 1.02.62.95 1.22-.03.24-.14.47-.32.65l-3.45 3.42c-.14.13-.2.33-.18.53l.57 4.61c.09.66-.38 1.27-1.03 1.35-.25.03-.5-.02-.72-.14l-3.64-2c-.26-.14-.58-.15-.85-.01l-3.77 1.95c-.53.27-1.18.06-1.45-.48-.11-.2-.14-.43-.11-.65l.3-2.12c.15-1.04.79-1.93 1.71-2.41l4.19-2.15c.11-.06.15-.2.1-.31-.05-.09-.14-.14-.24-.12l-5.12.74c-.78.11-1.58-.11-2.19-.62l-1.71-1.4c-.49-.4-.56-1.12-.17-1.62.19-.22.45-.37.74-.41l4.38-.57c.28-.03.52-.21.65-.46z' fill='%23ffb222' /%3E%3C/svg%3E" alt="" width={18} />
                          {gift.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="withdraw-section-gift">
                  <button className={`withdraw-btn-gift ${isGiftWithdrawDisabled ? "disabled" : ""}`} disabled={isGiftWithdrawDisabled} onClick={() => handleAction('GIFT')}>
                    {t("withdraw")} {selectedGift && `(${selectedGift.price})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="links-row">
            <div className="link-box">
              <div className="code-value link">t.me/Abdullayev_Stars_Bot?start={referralCode}</div>
              <button onClick={() => handleCopy(referralLink)} className="copy-btn">{copiedLink ? <Check size={16} color="#fff" /> : <Copy size={16} color="#fff" />}</button>
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