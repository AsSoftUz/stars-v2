import "./home.scss";
import { useEffect, useState } from "react";
import duck from "../../assets/duck.gif";
import starsImg from "../../assets/stars.png";
import premiumImg from "../../assets/premium.png";
import Nav from "../nav/nav.jsx";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Home = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="home">
        <div className="hero">
          <h1>
            {t("welcome")}
            <img src={duck} alt="" width="44px" />
          </h1>
          <p>{t("dearUser")}</p>
        </div>
        <div className="main-cards">
          <div className="pcard">
            <div className="card">
              <div className="left">
                <h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 26 30"
                  >
                    <path
                      fill="#fff"
                      d="M25.326 10.137a1.001 1.001 0 0 0-.807-.68l-7.34-1.066l-3.283-6.651c-.337-.683-1.456-.683-1.793 0L8.82 8.391L1.48 9.457a1 1 0 0 0-.554 1.705l5.312 5.178l-1.254 7.31a1.001 1.001 0 0 0 1.451 1.054L13 21.252l6.564 3.451a1 1 0 0 0 1.451-1.054l-1.254-7.31l5.312-5.178a.998.998 0 0 0 .253-1.024z"
                    />
                  </svg>
                  {t("stars")}
                </h2>
                <p>{t("starsSubtitle")}</p>
              </div>
              <div className="right">
                <img src={starsImg} alt="" />
              </div>
            </div>
            <NavLink to="/stars">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 26 30"
              >
                <path
                  fill="#fff"
                  d="M25.326 10.137a1.001 1.001 0 0 0-.807-.68l-7.34-1.066l-3.283-6.651c-.337-.683-1.456-.683-1.793 0L8.82 8.391L1.48 9.457a1 1 0 0 0-.554 1.705l5.312 5.178l-1.254 7.31a1.001 1.001 0 0 0 1.451 1.054L13 21.252l6.564 3.451a1 1 0 0 0 1.451-1.054l-1.254-7.31l5.312-5.178a.998.998 0 0 0 .253-1.024z"
                />
              </svg>
              {t("buyStars")}
            </NavLink>
          </div>
          <div className="pcard">
            <div className="card">
              <div className="left">
                <h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#fff"
                      d="M5 20v-2h14v2zm0-3.5L3.725 8.475q-.05 0-.113.013T3.5 8.5q-.625 0-1.062-.438T2 7t.438-1.062T3.5 5.5t1.063.438T5 7q0 .175-.038.325t-.087.275L8 9l3.125-4.275q-.275-.2-.45-.525t-.175-.7q0-.625.438-1.063T12 2t1.063.438T13.5 3.5q0 .375-.175.7t-.45.525L16 9l3.125-1.4q-.05-.125-.088-.275T19 7q0-.625.438-1.063T20.5 5.5t1.063.438T22 7t-.437 1.063T20.5 8.5q-.05 0-.112-.012t-.113-.013L19 16.5z"
                    />
                  </svg>
                  {t("premium")}
                </h2>
                <p>{t("premiumSubtitle")}</p>
              </div>
              <div className="right">
                <img src={premiumImg} alt="" />
              </div>
            </div>
            <NavLink to="/premium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  d="M5 20v-2h14v2zm0-3.5L3.725 8.475q-.05 0-.113.013T3.5 8.5q-.625 0-1.062-.438T2 7t.438-1.062T3.5 5.5t1.063.438T5 7q0 .175-.038.325t-.087.275L8 9l3.125-4.275q-.275-.2-.45-.525t-.175-.7q0-.625.438-1.063T12 2t1.063.438T13.5 3.5q0 .375-.175.7t-.45.525L16 9l3.125-1.4q-.05-.125-.088-.275T19 7q0-.625.438-1.063T20.5 5.5t1.063.438T22 7t-.437 1.063T20.5 8.5q-.05 0-.112-.012t-.113-.013L19 16.5z"
                />
              </svg>
              {t("buyPremium")}
            </NavLink>
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
};

export default Home;
