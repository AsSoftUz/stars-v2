import { useState, useEffect } from "react";
import "./premium.scss";
import Nav from "../nav/nav.jsx";
import premiumGif from "../../assets/premium.gif";
import { useTranslation } from 'react-i18next';
import useTelegramBack from "../../hooks/useTelegramBack";

const Premium = () => {
  useTelegramBack("/");
  const { t, i18n } = useTranslation();
  
  const premiumOptions = [
    { id: 1, amount: 1, price: 5000 },
    { id: 2, amount: 3, price: 18000 },
    { id: 3, amount: 12, price: 180000 },
  ];

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState(""); // 1. Username state qo'shildi

  // 2. Validatsiya: paket tanlangan bo'lishi va username bo'sh bo'lmasligi kerak
  const isFormInvalid = !selected || username.trim().length === 0;

  return (
    <>
      <div className="premium">
        <header>
          <div className="left">
            <h2>{t('buyPremium')}</h2>
            <p>{t('premiumSubtitle')}</p>
          </div>
          <div className="right">
            <img src={premiumGif} alt="" width="100px" />
          </div>
        </header>

        <div className="send">
          <div className="forWho">
            <label htmlFor="name">
              {t('forWho')}
              {/* "For me" bosilganda username-ni to'ldirish (ixtiyoriy) */}
              <a href="#" onClick={(e) => { e.preventDefault(); setUsername("MyUsername"); }}>
                {t('forMe')}
              </a>
            </label>
            {/* 3. Input value va onChange qo'shildi */}
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
                    <span className="amount">{option.amount} {t('month')}</span>
                  </div>

                  <div className="price">{option.price.toLocaleString()} UZS</div>
                </div>
              ))}
            </div>

            {/* 4. Button disabled holati va stilistikasi */}
            <button 
              className="buy-button"
              disabled={isFormInvalid}
              style={{ 
                opacity: isFormInvalid ? 0.6 : 1, 
                cursor: isFormInvalid ? "not-allowed" : "pointer",
                transition: "0.3s"
              }}
            >
              {t('buyPremium')}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Premium;