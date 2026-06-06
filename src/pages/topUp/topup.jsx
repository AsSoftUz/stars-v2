import "./topup.scss";
import { useState, useMemo, useEffect } from "react";
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

  const { user, isTelegram } = useGetOrCreateUser();
  const { starsOptions, loading: starsLoading } = useGetStars();
  const { submitTopup: submitAdminTopup, loading: adminLoading } = useTopup();
  const { submitTopup: submitClickTopup, loading: clickLoading } = useBuyClick();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("click");
  const [receipt, setReceipt] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle");

  const cardHolderNumber = "9860 2566 0185 7111";

  // --- SAHIFAGA QAYTGANDA LOADINGNI TOZALASH ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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

  // --- BIRINCHI MARTA YUKLANGANDA DEFAULT SUMMANI INPUTGA QO'YISH ---
  useEffect(() => {
    if (presetData.length > 0 && selectedIdx !== null && !customAmount) {
      // Narxni butun son ko'rinishida olish (masalan: 12500.00 -> 12500)
      const initialPrice = Math.floor(Number(presetData[selectedIdx].price));
      setCustomAmount(initialPrice.toString());
    }
  }, [presetData, selectedIdx]);

  // Asosiy jo'natiladigan summa
  const currentAmount = customAmount || 0;

  // --- FUNKSIYALAR ---
  const formatNumber = (val) => {
    if (!val) return "";
    // Nuqta va undan keyingi nollarni tozalab tashlaymiz (.00 muammosi uchun)
    const cleanVal = val.toString().split('.')[0];
    return cleanVal.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
    const cleanNumber = cardHolderNumber.replace(/\s/g, '');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cleanNumber)
        .then(() => {
          handleCopySuccess();
        })
        .catch((err) => {
          console.error('Kopyalashda xatolik:', err);
          fallbackCopyText(cleanNumber);
        });
    } else {
      fallbackCopyText(cleanNumber);
    }
  };

  const handleCopySuccess = () => {
    tg?.HapticFeedback.notificationOccurred('success');
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

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
          amount: currentAmount,
          file: receipt
        });
        tg?.HapticFeedback.notificationOccurred('success');
        setModalStatus("success");
        setTimeout(() => { setModalOpen(false); navigate("/settings"); }, 4000);
      } else {
        const data = await submitClickTopup({ amount: currentAmount });
        if (data?.click_url) {
          tg?.HapticFeedback.notificationOccurred('success');
          setModalOpen(false);
          setModalStatus("idle");

          if (tg) {
            tg.openLink(data.click_url);
          } else {
            window.location.href = data.click_url;
          }
        } else {
          throw new Error("Click URL not found");
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

          <div className="section" style={{ border: 'none', padding: 0, margin: 0 }}>
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
                  setSelectedIdx(null); // Qo'lda yozganda grid dagi aktivlik o'chadi
                  tg?.HapticFeedback.selectionChanged();
                }
              }}
            />
            {customAmount && Number(customAmount) < 1000 && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                {t("min_amount_error") || "Minimal summa: 1 000 UZS"}
              </p>
            )}
            <p style={{ color: 'blue', fontSize: '12px', marginTop: '5px', marginLeft: '12px' }}>
              {t("enterOrSelect") || "Summani kiriting yoki pastdan tanlang"}
            </p>
            
            <p className="section-label" style={{ marginTop: '20px' }}>{t("select_amount")}</p>

            <div className="amount-grid">
              {presetData.map((item, idx) => {
                // Tugmadagi narxlardan ham .00 ni olib tashlaymiz
                const cleanPrice = Math.floor(Number(item.price));
                return (
                  <button
                    key={idx}
                    className={`amount-btn ${selectedIdx === idx ? "active" : ""}`}
                    onClick={() => {
                      tg?.HapticFeedback.selectionChanged();
                      setSelectedIdx(idx);
                      setCustomAmount(cleanPrice.toString()); // Grid bosilganda toza son inputga o'tadi
                    }}
                  >
                    <span className="star-price">{cleanPrice.toLocaleString()} UZS</span>
                  </button>
                );
              })}
            </div>

            {starsOptions?.length > 4 && (
              <button
                className="show-all-btn-centered"
                onClick={() => {
                  setShowAllPrices(!showAllPrices);
                  setSelectedIdx(0);
                  if (presetData[0]) {
                    const cleanPrice = Math.floor(Number(presetData[0].price));
                    setCustomAmount(cleanPrice.toString());
                  }
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