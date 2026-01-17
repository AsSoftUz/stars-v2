import "./topup.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  Upload,
  Copy,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useTranslation } from 'react-i18next';

import Nav from "../nav/nav";
import headerImg from "../../assets/topupGif.mp4";
import useTelegramBack from "../../hooks/useTelegramBack";
import useGetOrCreateUser from "../../hooks/useGetOrCreateUser";
import useTopup from "../../hooks/useTopup"; // Admin uchun hook
import useBuyClick from "../../hooks/useBuyClick"; // Click uchun hook

const Topup = () => {
  useTelegramBack("/settings");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;
  const { user } = useGetOrCreateUser(tgUser);

  const { submitTopup: submitAdminTopup } = useTopup();
  const { submitTopup: submitClickTopup } = useBuyClick();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("click");
  const [receipt, setReceipt] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("idle");

  const cardHolderNumber = "9860 1234 5678 9012";
  const presetAmounts = [10500, 21000, 52500, 105000];
  const currentAmount = customAmount || (selectedIdx !== null ? presetAmounts[selectedIdx] : 0);

  // --- YORDAMCHI FUNKSIYALAR ---
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
    navigator.clipboard.writeText(cardHolderNumber.replace(/\s/g, ''));
    tg?.HapticFeedback.notificationOccurred('success'); // Vibro
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const handlePaymentSubmit = async () => {
    tg?.HapticFeedback.impactOccurred('medium'); // Vibro
    setModalOpen(true);
    setModalStatus("loading");

    try {
      if (paymentMethod === "admin") {
        await submitAdminTopup({
          user_id: tgUser?.id,
          amount: currentAmount,
          file: receipt
        });
        tg?.HapticFeedback.notificationOccurred('success'); // Success Vibro
        setModalStatus("success");
        setTimeout(() => {
          setModalOpen(false);
          navigate("/settings");
        }, 4000);

      } else {
        const data = await submitClickTopup({
          user_id: tgUser?.id,
          amount: currentAmount
        });

        if (data && data.click_url) {
          tg?.HapticFeedback.notificationOccurred('success'); // Success Vibro
          setModalOpen(false);
          setModalStatus("idle");

          if (tg) {
            tg.openLink(data.click_url); // Tashqi app/brauzerda ochish
          } else {
            window.location.href = data.click_url;
          }
        } else {
          throw new Error("Click URL topilmadi");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      tg?.HapticFeedback.notificationOccurred('error'); // Error Vibro
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
                  <p className="success-title">{t("payment_sent_admin_title") || "Xabar yuborildi!"}</p>
                  <p className="success-desc">
                    {t("payment_sent_admin_desc") || "To'lov cheki adminga yuborildi. Tasdiqlangach, balansingiz to'ldiriladi."}
                  </p>
                </div>
              )}

              {modalStatus === "error" && (
                <div className="status-box">
                  <XCircle className="error-icon" size={60} />
                  <p>{t("payment_error") || "Xatolik yuz berdi"}</p>
                  <button onClick={() => { setModalOpen(false); setModalStatus("idle"); }} className="modal-close-btn">
                    {t("close_modal") || "Yopish"}
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
              {presetAmounts.map((amt, idx) => (
                <button
                  key={idx}
                  className={`amount-btn ${selectedIdx === idx ? "active" : ""}`}
                  onClick={() => { 
                    tg?.HapticFeedback.selectionChanged(); // Vibro
                    setSelectedIdx(idx); 
                    setCustomAmount(""); 
                  }}
                >
                  {amt.toLocaleString()} UZS
                </button>
              ))}
            </div>

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
                  tg?.HapticFeedback.selectionChanged(); // Vibro
                }
              }}
            />
            {Number(currentAmount) < 1000 && currentAmount !== "" && (
              <p style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '5px' }}>Min: 1 000 UZS</p>
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
                <p className="card-holder">Abdullajonov Adhamjon</p>

                <div className="upload-section">
                  <label htmlFor="receipt-upload" className="upload-label" onClick={() => tg?.HapticFeedback.impactOccurred('light')}>
                    <Upload size={20} />
                    <span>{receipt ? receipt.name : t("upload_receipt")}</span>
                    <input
                      id="receipt-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReceipt(e.target.files[0])}
                      hidden
                    />
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