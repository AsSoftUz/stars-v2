import { useState, useEffect } from "react";
import "./stars.scss";
import Nav from "../nav/nav.jsx";
import starsImg from "../../assets/starspageImg.png";

const Stars = () => {
  const starsOptions = [
    { id: 1, amount: 50, price: 5000 },
    { id: 2, amount: 200, price: 18000 },
  ];

  const [selected, setSelected] = useState(null);

  return (
    <div className="stars">
      <header>
        <h2>Telegram Stars sotib olish</h2>
        <p>
          Visa kartasiz Telegram Stars balansini o‘zingiz yoki yaqinlaringiz
          uchun to‘ldirib oling
        </p>
      </header>
      <div className="send">
        <div className="forWho">
          <label htmlFor="name">Kimga yuboramiz?</label>
          <input type="text" placeholder="@username kiriting..." id="name" />
        </div>
        <div className="forWho">
          <label htmlFor="amount">Telegram yulduzlari miqdorini kiriting</label>
          <input
            type="text"
            placeholder="50 dan 10 000 gacha miqdorni kiriting"
            id="amount"
          />
        </div>
      </div>
      <div className="main">
        <div className="stars-container">
            <h3>Stars paketlarini tanlang</h3>
          <div className="options-list">
            {starsOptions.map((option) => (
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
                  <span className="stars-icon">
                    <img src={starsImg} alt="" />
                  </span>
                  <span className="amount">{option.amount}</span>
                </div>

                <div className="price">{option.price}</div>
              </div>
            ))}
          </div>

          <button className="show-more">
            Ko‘proq variantlarni ko‘rsatish <span>⌵</span>
          </button>

          <button className="buy-button">Telegram Stars sotib olish</button>
        </div>
      </div>
      <Nav />
    </div>
  );
};

export default Stars;
