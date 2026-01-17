import "./topup.scss";
import { useState, useMemo, useEffect } from "react"; // useEffect qo'shildi
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  Upload,
  Copy,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useTranslation } from 'react-i18next';

import Nav from "../nav/nav";
import headerImg from "../../assets/topupGif.mp4";
import useTelegramBack from "../../hooks/useTelegramBack";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";
import useTopup from "../../hooks/useTopup";
import useBuyClick from "../../hooks/useBuyClick";
import useGetStars from "../../hooks/useGetStars";

const Topup = () => {
  useTelegramBack("/settings");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;

  const { user } = useGetOrCreateUser(tgUser);
  const { starsOptions, loading: starsLoading } = useGetStars();
  const { submitTopup: submitAdminTopup } = useTopup();
  const { submitTopup: submitClickTopup } = useBuyClick();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("click");
  const [receipt, setReceipt] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle");

  const cardHolderNumber = "9860 1766 1880 7588";

  // --- SAHIFAGA QAYTGANDA LOADINGNI TOZALASH ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Agar foydalanuvchi tashqaridan qaytib kirsa va Click tanlangan bo'lsa, loadingni yopamiz
        if (modalStatus === "loading" && paymentMethod === "click") {
          setModalOpen(false);
          setModalStatus("idle");
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [modalStatus, paymentMethod]);

  // --- DINAMIK NARXLAR MANTIQI ---
  const presetData = useMemo(() => {
    if (!starsOptions || starsOptions.length === 0) return [];

    const allSorted = [...starsOptions].sort((a, b) => a.amount - b.amount);

    if (showAllPrices) {
      return allSorted;
    } else {
      const targets = [50, 100, 250, 500];
      const mainOnes = allSorted.filter(opt => targets.includes(opt.amount));
      return mainOnes.length > 0 ? mainOnes : allSorted.slice(0, 4);
    }
  }, [starsOptions, showAllPrices]);

  const currentAmount = customAmount || (selectedIdx !== null ? presetData[selectedIdx]?.price : 0);

  // --- FUNKSIYALAR ---
  const formatNumber = (val) => {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const deformatNumber = (val) => {
    return val.replace(/\s/g, "");
  };

  const isFormInvalid = () => {
    const amount = Number(currentAmount);
    if (amount < 1000) return true;
    if (paymentMethod === "admin" && !receipt) return true;
    return false;
  };

  const copyToClipboard = () => {
    // 1. Probelsiz faqat raqamlarni olish
    const cleanNumber = cardHolderNumber.replace(/\s/g, '');

    // 2. To'g'ri metod: writeText
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanNumber)
        .then(() => {
          handleCopySuccess();
        })
        .catch((err) => {
          console.error('Kopyalashda xatolik:', err);
          fallbackCopyText(cleanNumber); // Agar writeText ishlamasa
        });
    } else {
      fallbackCopyText(cleanNumber); // Eski brauzerlar uchun
    }
  };

  // Muvaffaqiyatli kopyalangan holat uchun alohida funksiya
  const handleCopySuccess = () => {
    tg?.HapticFeedback.notificationOccurred('success');
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  // Eski usul (fallback) - agar navigator.clipboard ishlamasa
  const fallbackCopyText = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      handleCopySuccess();
    } catch (err) {
      console.error('Fallback kopyalash ham ishlamadi', err);
    }
    document.body.removeChild(textArea);
  };

  const handlePaymentSubmit = async () => {
    tg?.HapticFeedback.impactOccurred('medium');
    setModalOpen(true);
    setModalStatus("loading");

    try {
      if (paymentMethod === "admin") {
        await submitAdminTopup({
          user_id: tgUser?.id,
          amount: currentAmount,
          file: receipt
        });
        tg?.HapticFeedback.notificationOccurred('success');
        setModalStatus("success");
        setTimeout(() => { setModalOpen(false); navigate("/settings"); }, 4000);
      } else {
        const data = await submitClickTopup({ user_id: tgUser?.id, amount: currentAmount });
        if (data?.click_url) {
          tg?.HapticFeedback.notificationOccurred('success');

          // Tashqi linkka o'tishdan oldin statelarni tozalaymiz
          setModalOpen(false);
          setModalStatus("idle");

          if (tg) {
            tg.openLink(data.click_url);
          } else {
            window.location.href = data.click_url;
          }
        } else {
          throw new Error("Click URL topilmadi");
        }
      }
    } catch (err) {
      tg?.HapticFeedback.notificationOccurred('error');
      setModalStatus("error");
    }
  };

  return (
    <>
      <div className="topup">
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {modalStatus === "loading" && (
                <div className="status-box">
                  <Loader2 className="spinner-icon animate-spin" size={60} />
                  <p>{t("sending_payment")}</p>
                </div>
              )}
              {modalStatus === "success" && (
                <div className="status-box">
                  <CheckCircle2 className="success-icon animate-tick" size={60} />
                  <p className="success-title">{t("payment_sent_admin_title")}</p>
                  <p className="success-desc">{t("payment_sent_admin_desc")}</p>
                </div>
              )}
              {modalStatus === "error" && (
                <div className="status-box">
                  <XCircle className="error-icon" size={60} />
                  <p>{t("payment_error")}</p>
                  <button onClick={() => { setModalOpen(false); setModalStatus("idle"); }} className="modal-close-btn">
                    {t("close_modal")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <header>
          <div className="left">
            <h2>{t("topup_title")}</h2>
            <p>{t("topup_subtitle")}</p>
          </div>
          <div className="right">
            <video autoPlay muted loop playsInline className="gif-video">
              <source src={headerImg} type="video/mp4" />
            </video>
          </div>
        </header>

        <div className="payment-page">
          <div className="balance-info">
            <span>{t("my_balance")}</span>
            <span className="amount-gold">
              {user ? Number(user.balance).toLocaleString('ru-RU').replace(/,/g, ' ') : "0"} UZS
            </span>
          </div>

          <div className="section">
            <p className="section-label">{t("select_amount")}</p>

            <div className="amount-grid">
              {presetData.map((item, idx) => (
                <button
                  key={idx}
                  className={`amount-btn ${selectedIdx === idx ? "active" : ""}`}
                  onClick={() => {
                    tg?.HapticFeedback.selectionChanged();
                    setSelectedIdx(idx);
                    setCustomAmount("");
                  }}
                >
                  <span className="star-price">{Number(item.price).toLocaleString()} UZS</span>
                </button>
              ))}
            </div>

            {starsOptions?.length > 4 && (
              <button
                className="show-all-btn-centered"
                onClick={() => {
                  setShowAllPrices(!showAllPrices);
                  setSelectedIdx(0);
                  tg?.HapticFeedback.impactOccurred('light');
                }}
              >
                {showAllPrices ? (
                  <><ChevronUp size={18} /> {t("hide_prices") || "Yashirish"}</>
                ) : (
                  <><ChevronDown size={18} /> {t("show_all_prices") || "Barcha narxlar"}</>
                )}
              </button>
            )}

            <input
              type="text"
              inputMode="numeric"
              className={`custom-input ${customAmount ? "active" : ""}`}
              placeholder={t("enter_custom_amount")}
              value={formatNumber(customAmount)}
              onChange={(e) => {
                const rawValue = deformatNumber(e.target.value);
                if (/^\d*$/.test(rawValue)) {
                  setCustomAmount(rawValue);
                  setSelectedIdx(null);
                  tg?.HapticFeedback.selectionChanged();
                }
              }}
            />
          </div>

          <div className="section">
            <p className="section-label">{t("select_payment_method")}</p>

            <div className={`method-card ${paymentMethod === "click" ? "selected" : ""}`} onClick={() => { tg?.HapticFeedback.impactOccurred('light'); setPaymentMethod("click"); }}>
              <div className="icon-box"><CreditCard size={20} /></div>
              <div className="method-info">
                <span className="title">{t("click_payment")}</span>
                <span className="desc">{t("click_payment_desc")}</span>
              </div>
            </div>

            <div className={`method-card ${paymentMethod === "admin" ? "selected" : ""}`} onClick={() => { tg?.HapticFeedback.impactOccurred('light'); setPaymentMethod("admin"); }}>
              <div className="icon-box"><ShieldCheck size={20} /></div>
              <div className="method-info">
                <span className="title">{t("admin_payment")}</span>
                <span className="desc">{t("admin_payment_desc")}</span>
              </div>
            </div>

            {paymentMethod === "admin" && (
              <div className="admin-details-expand">
                <div className="card-copy-box">
                  <div className="card-number">
                    <label>{t("transfer_to_card")}</label>
                    <div className="number-row">
                      <span>{cardHolderNumber}</span>
                      <div className="copy-btn-wrapper">
                        {showTooltip && <span className="copy-tooltip">{t("copied")}</span>}
                        <button onClick={copyToClipboard}><Copy size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="card-holder">A.Abdullajonov</p>
                <div className="upload-section">
                  <label htmlFor="receipt-upload" className="upload-label">
                    <Upload size={20} />
                    <span>{receipt ? receipt.name : t("upload_receipt")}</span>
                    <input id="receipt-upload" type="file" accept="image/*" onChange={(e) => setReceipt(e.target.files[0])} hidden />
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            className={`main-action-btn ${!isFormInvalid() ? "active" : "disabled"}`}
            disabled={isFormInvalid() || modalStatus === "loading"}
            onClick={handlePaymentSubmit}
          >
            {modalStatus === "loading" ? <Loader2 className="animate-spin" size={20} /> : t("confirm_payment")}
          </button>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Topup;