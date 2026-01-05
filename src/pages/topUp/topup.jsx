import "./topup.scss";
import Nav from "../nav/nav";
import { CreditCard, ShieldCheck, Upload, Copy } from "lucide-react";
import { useState } from "react";
import headerImg from "../../assets/headerImg.gif";
import { useTranslation } from 'react-i18next';

const Topup = () => {
  const { t } = useTranslation();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("click");
  const [receipt, setReceipt] = useState(null);
  
  // Tooltip uchun holat
  const [showTooltip, setShowTooltip] = useState(false);
  
  const cardHolderNumber = "9860 1234 5678 9012";
  const presetAmounts = [10000, 20000, 50000, 100000];
  const myBalance = "19 669 000";

  const currentAmount = customAmount || (selectedIdx !== null ? presetAmounts[selectedIdx] : 0);

  const isFormValid = () => {
    if (paymentMethod === "click") {
      return currentAmount > 0;
    } else {
      return currentAmount > 0 && receipt !== null;
    }
  };

  const handleSelectAmount = (index, value) => {
    setSelectedIdx(index);
    setCustomAmount("");
  };

  const handleCustomInput = (val) => {
    setCustomAmount(val);
    setSelectedIdx(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  // Alert o'rniga Tooltip funksiyasi
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cardHolderNumber.replace(/\s/g, ''));
    setShowTooltip(true);
    // 2 soniyadan keyin tooltipni yashirish
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  return (
    <>
      <div className="topup">
        <header>
          <div className="left">
            <h2>{t("topup_title")}</h2>
            <p>{t("topup_subtitle")}</p>
          </div>
          <div className="right">
            <img src={headerImg} alt="" width="100px" />
          </div>
        </header>

        <div className="payment-page">
          <div className="balance-info">
            <span>{t("my_balance")}</span>
            <span className="amount-gold">{myBalance} UZS</span>
          </div>

          <div className="section">
            <p className="section-label">{t("select_amount")}</p>
            <div className="amount-grid">
              {presetAmounts.map((amt, idx) => (
                <button
                  key={idx}
                  className={`amount-btn ${selectedIdx === idx ? "active" : ""}`}
                  onClick={() => handleSelectAmount(idx, amt)}
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

            <div
              className={`method-card ${paymentMethod === "click" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("click")}
            >
              <div className="icon-box"><CreditCard size={20} /></div>
              <div className="method-info">
                <span className="title">{t("click_payment")}</span>
                <span className="desc">{t("click_payment_desc")}</span>
              </div>
            </div>

            <div
              className={`method-card ${paymentMethod === "admin" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("admin")}
            >
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
                        {/* Tooltip elementi */}
                        {showTooltip && <span className="copy-tooltip">{t("copied")}</span>}
                        <button onClick={copyToClipboard}>
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="upload-section">
                  <label htmlFor="receipt-upload" className="upload-label">
                    <Upload size={20} />
                    <span>{receipt ? receipt.name : t("upload_receipt")}</span>
                    <input id="receipt-upload" type="file" accept="image/*" onChange={handleFileChange} hidden />
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            className={`main-action-btn ${isFormValid() ? "active" : "disabled"}`}
            disabled={!isFormValid()}
            onClick={() => alert(t("payment_sent"))}
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