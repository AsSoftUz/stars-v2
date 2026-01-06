import { useState } from "react";
import "./stars.scss";
import Nav from "../nav/nav.jsx";
import headerImg from "../../assets/starsGif.mp4";
import { useTranslation } from 'react-i18next';
import useTelegramBack from "../../hooks/useTelegramBack";
import { ChevronUp, ChevronDown } from "lucide-react";

const Stars = () => {
  useTelegramBack("/");
  const { t } = useTranslation();

  const starsOptions = [
    { id: 1, amount: 50, price: 5000 },
    { id: 2, amount: 150, price: 14000 },
    { id: 3, amount: 250, price: 22000 },
    { id: 4, amount: 500, price: 42000 },
    { id: 5, amount: 1000, price: 80000 },
    { id: 6, amount: 2500, price: 190000 },
    { id: 7, amount: 5000, price: 350000 },
  ];

  const [selected, setSelected] = useState(null);
  const [username, setUsername] = useState("");
  const [showAll, setShowAll] = useState(false); // Ko'proq tugmasi uchun state

  const getStarLayers = (amount) => {
    if (amount >= 2500) return 5;
    if (amount >= 1000) return 4;
    if (amount >= 250) return 3;
    return 2;
  };

  const isFormInvalid = !selected || username.trim().length === 0;

  // Ko'rsatiladigan paketlar ro'yxatini hisoblaymiz
  const visibleOptions = showAll ? starsOptions : starsOptions.slice(0, 3);

  return (
    <>
      <div className="stars">
        <header>
          <div className="left">
            <h2>{t("stars_title")}</h2>
            <p>{t("stars_subtitle")}</p>
          </div>
          <div className="right">
            <video autoPlay muted loop playsInline className="gif-video">
              <source src={headerImg} type="video/mp4" />
              Sizning brauzeringiz videoni qo'llab-quvvatlamaydi.
            </video>
          </div>
        </header>

        <div className="send">
          <div className="forWho">
            <label htmlFor="name">
              {t("stars_forWho")}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setUsername("Mening_Usernamem");
                }}
              >
                {t("forMe")}
              </a>
            </label>
            <input
              type="text"
              placeholder={t("enterUsername")}
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="main">
          <div className="stars-container">
            <h3>{t("stars_packages")}</h3>
            <div className="options-list">
              {visibleOptions.map((option) => (
                <div
                  key={option.id}
                  className={`option-item ${
                    selected === option.id ? "active" : ""
                  }`}
                  onClick={() => setSelected(option.id)}
                >
                  <div className="radio-circle">
                    {selected === option.id && <div className="inner-dot" />}
                  </div>

                  <div className="stars-info">
                    <div className="stars-stack">
                      {[...Array(getStarLayers(option.amount))].map((_, i) => (
                        <i key={i} className="star-icon"></i>
                      ))}
                    </div>
                    <span className="amount">
                      {option.amount.toLocaleString()} Stars
                    </span>
                  </div>

                  <div className="price">
                    {option.price.toLocaleString()} UZS
                  </div>
                </div>
              ))}
            </div>

            {/* "Ko'proq" tugmasi: faqat hamma elementlar ko'rinmayotgan bo'lsa chiqadi */}
            {starsOptions.length > 3 && (
              <button
                className="show-more"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    {" "}
                    {t("stars_showLess")}{" "}
                    <span className="arrow-up">
                      <ChevronUp stroke="#248bda"/>
                    </span>{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    {t("stars_showMore")}{" "}
                    <span className="arrow-down">
                      <ChevronDown stroke="#248bda"/>
                    </span>{" "}
                  </>
                )}
              </button>
            )}

            <button className="buy-button" disabled={isFormInvalid}>
              {t("stars_buyButton")}
            </button>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Stars;
