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
import useTopup from "../../hooks/useTopup";

const Topup = () => {
  useTelegramBack("/settings");
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Telegram va User ma'lumotlari
  const tg = window.Telegram?.WebApp;
  const tgUser = tg?.initDataUnsafe?.user;
  const { user } = useGetOrCreateUser(tgUser);

  // Topup API hooki
  const { submitTopup } = useTopup();

  // Local holatlar
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("click");
  const [receipt, setReceipt] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // MODAL holatlari
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("loading"); // loading, success, error

  const cardHolderNumber = "9860 1234 5678 9012";
  const presetAmounts = [10000, 20000, 50000, 100000];
  const currentAmount = customAmount || (selectedIdx !== null ? presetAmounts[selectedIdx] : 0);

  const isFormValid = () => {
    const amount = Number(currentAmount);
    if (paymentMethod === "click") return amount >= 5000;
    return amount >= 5000 && receipt !== null;
  };

  const handleSelectAmount = (index) => {
    setSelectedIdx(index);
    setCustomAmount("");
  };

  const handleCustomInput = (val) => {
    setCustomAmount(val);
    setSelectedIdx(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cardHolderNumber.replace(/\s/g, ''));
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === "admin") {
      setModalOpen(true);
      setModalStatus("loading");

      try {
        await submitTopup({
          user_id: tgUser?.id,
          amount: currentAmount,
          file: receipt
        });
        
        setModalStatus("success");
        // 3 soniyadan keyin avtomat settingsga o'tish
        setTimeout(() => {
          setModalOpen(false);
          navigate("/settings");
        }, 3000);
        
      } catch (err) {
        setModalStatus("error");
      }
    } else {
      alert("Click xizmati tez kunda ishga tushadi!");
    }
  };

  return (
    <>
      <div className="topup">
        {/* Modal: To'lov holati */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {modalStatus === "loading" && (
                <div className="status-box">
                  <Loader2 className="spinner-icon" size={60} />
                  <p>{t("sending_payment") || "Yuborilmoqda..."}</p>
                </div>
              )}

              {modalStatus === "success" && (
                <div className="status-box">
                  <CheckCircle2 className="success-icon animate-tick" size={60} />
                  <p>{t("payment_sent") || "Muvaffaqiyatli yuborildi!"}</p>
                </div>
              )}

              {modalStatus === "error" && (
                <div className="status-box">
                  <XCircle className="error-icon" size={60} />
                  <p>{t("payment_error") || "Xatolik yuz berdi"}</p>
                  <button onClick={() => setModalOpen(false)} className="modal-close-btn">
                    Yopish
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
                  onClick={() => handleSelectAmount(idx)}
                >
                  {amt.toLocaleString()} UZS
                </button>
              ))}
            </div>

            <input
              type="number"
              className={`custom-input ${customAmount ? "active" : ""}`}
              placeholder={t("enter_custom_amount")}
              value={customAmount}
              onChange={(e) => handleCustomInput(e.target.value)}
            />
          </div>

          <div className="section">
            <p className="section-label">{t("select_payment_method")}</p>

            <div className={`method-card ${paymentMethod === "click" ? "selected" : ""}`} onClick={() => setPaymentMethod("click")}>
              <div className="icon-box"><CreditCard size={20} /></div>
              <div className="method-info">
                <span className="title">{t("click_payment")}</span>
                <span className="desc">{t("click_payment_desc")}</span>
              </div>
            </div>

            <div className={`method-card ${paymentMethod === "admin" ? "selected" : ""}`} onClick={() => setPaymentMethod("admin")}>
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
                <p className="card-holder">Abdullajonov A.</p>

                <div className="upload-section">
                  <label htmlFor="receipt-upload" className="upload-label">
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
            className={`main-action-btn ${isFormValid() ? "active" : "disabled"}`}
            disabled={!isFormValid()}
            onClick={handlePaymentSubmit}
          >
            {t("confirm_payment")}
          </button>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Topup;