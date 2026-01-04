import "./settings.scss";
import premiumImg from "../../assets/premium.png";
import Nav from "../nav/nav.jsx";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from 'react';
import {
  Globe,
  CreditCard,
  Headphones,
  Megaphone,
  ChevronDown,
} from "lucide-react";

const Settings = () => {
const [openDropdown, setOpenDropdown] = useState(null);

  // localStorage-dan qiymatlarni olish (dastlabki holat)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_lang') || 'UZB';
  });

  const [payment, setPayment] = useState(() => {
    return localStorage.getItem('app_payment') || 'Payme';
  });

  // Til o'zgarganda localStorage-ga yozish
  useEffect(() => {
    localStorage.setItem('app_lang', language);
  }, [language]);

  // To'lov usuli o'zgarganda localStorage-ga yozish
  useEffect(() => {
    localStorage.setItem('app_payment', payment);
  }, [payment]);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelect = (type, value) => {
    if (type === 'til') setLanguage(value);
    if (type === 'tolov') setPayment(value);
    setOpenDropdown(null);
  };
  return (
    <>
      <div className="settings">
        <header>
          <img src={premiumImg} alt="" />
          <h2>Name</h2>
        </header>
        <div className="balance">
          <h2>0 UZS</h2>
          <NavLink title="Home" to="/">
            Hisobni to'ldirish
          </NavLink>
        </div>
        <div className="settings-container">
          {/* Til Dropdown */}
          <div className="settings-wrapper">
            <div
              className="settings-item"
              onClick={() => toggleDropdown("til")}
            >
              <div className="left-side">
                <span className="icon-wrapper">
                  <Globe size={18} />
                </span>
                <span className="label">Til</span>
              </div>
              <div className="right-side">
                <span className="value">{language}</span>
                <ChevronDown
                  size={14}
                  className={`arrow-icon ${
                    openDropdown === "til" ? "open" : ""
                  }`}
                />
              </div>
            </div>
            {openDropdown === "til" && (
              <div className="dropdown-menu">
                <div onClick={() => handleSelect("til", "UZB")}>UZB</div>
                <div onClick={() => handleSelect("til", "RUS")}>RUS</div>
                <div onClick={() => handleSelect("til", "ENG")}>ENG</div>
              </div>
            )}
          </div>

          {/* Tolov usulu Dropdown */}
          <div className="settings-wrapper">
            <div
              className="settings-item"
              onClick={() => toggleDropdown("tolov")}
            >
              <div className="left-side">
                <span className="icon-wrapper">
                  <CreditCard size={18} />
                </span>
                <span className="label">Tolov usulu</span>
              </div>
              <div className="right-side">
                <span className="value">{payment}</span>
                <ChevronDown
                  size={14}
                  className={`arrow-icon ${
                    openDropdown === "tolov" ? "open" : ""
                  }`}
                />
              </div>
            </div>
            {openDropdown === "tolov" && (
              <div className="dropdown-menu">
                <div onClick={() => handleSelect("tolov", "Payme")}>Payme</div>
                <div onClick={() => handleSelect("tolov", "Click")}>Click</div>
              </div>
            )}
          </div>

          {/* Oddiy qatorlar */}
          <div className="settings-item">
            <div className="left-side">
              <span className="icon-wrapper">
                <Headphones size={18} />
              </span>
              <span className="label">Yordam</span>
            </div>
            <div className="right-side">
              <span className="value">@helpmme</span>
            </div>
          </div>

          <div className="settings-item">
            <div className="left-side">
              <span className="icon-wrapper">
                <Megaphone size={18} />
              </span>
              <span className="label">Yangiliklar kanali</span>
            </div>
            <div className="right-side">
              <span className="value">@news</span>
            </div>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Settings;
