import { useState } from "react";
import "./stars.scss";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/headerImg.gif";
import { useTranslation } from 'react-i18next';
import useTelegramBack from "../../hooks/useTelegramBack";

const Stars = () => {
  useTelegramBack("/");
  const { t } = useTranslation();
  
  const starsOptions = [
    { id: 1, amount: 50, price: 5000 },
    { id: 2, amount: 150, price: 14000 },
    { id: 3, amount: 250, price: 22000 },
    { id: 4, amount: 500, price: 42000 },
  ];

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState(""); // 1. Username state qo'shildi

  // 2. Validatsiya sharti: username bo'sh bo'lmasligi va paket tanlangan bo'lishi kerak
  const isFormInvalid = !selected || username.trim().length === 0;

  return (
    <>
      <div className="stars">
        <header>
          <div className="left">
            <h2>{t('stars_title')}</h2>
            <p>{t('stars_subtitle')}</p>
          </div>
          <div className="right">
            <img src={headerImg} alt="Header" width="100px" />
          </div>
        </header>

        <div className="send">
          <div className="forWho">
            <label htmlFor="name">
              {t('stars_forWho')}
              <a href="#" onClick={(e) => { e.preventDefault(); setUsername("Mening_Usernamem"); }}>{t('forMe')}</a>
            </label>
            {/* 3. Input state-ga bog'landi */}
            <input 
              type="text" 
              placeholder={t('enterUsername')} 
              id="name" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="forWho">
            <label htmlFor="amount">{t('stars_amount')}</label>
            <input type="text" placeholder={t('stars_amount_placeholder')} id="amount" />
          </div>
        </div>

        <div className="main">
          <div className="stars-container">
            <h3>{t('stars_packages')}</h3>
            <div className="options-list">
              {starsOptions.map((option) => {
                const starIconsCount = Math.min(Math.floor(option.amount / 50), 10);
                
                return (
                  <div
                    key={option.id}
                    className={`option-item ${selected === option.id ? "active" : ""}`}
                    onClick={() => setSelected(option.id)}
                  >
                    <div className="radio-circle">
                      {selected === option.id && <div className="inner-dot" />}
                    </div>

                    <div className="stars-info">
                      <div className="stars-row">
                        {[...Array(starIconsCount)].map((_, index) => (
                          <i key={index} className="star-icon"></i>
                        ))}
                      </div>
                      <span className="amount">{option.amount.toLocaleString()}</span>
                    </div>

                    <div className="price">{option.price.toLocaleString()} UZS</div>
                  </div>
                );
              })}
            </div>

            {/* 4. Button disabled holati qo'shildi */}
            <button 
              className="buy-button" 
              disabled={isFormInvalid}
              style={{ opacity: isFormInvalid ? 0.5 : 1, cursor: isFormInvalid ? "not-allowed" : "pointer" }}
            >
              {t('stars_buyButton')}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Stars;