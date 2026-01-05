import "./nav.scss";
import { NavLink } from "react-router-dom";
import { Star, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { t, i18n } = useTranslation();
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            title="Home"
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M12 3s-6.186 5.34-9.643 8.232A1.041 1.041 0 0 0 2 12a1 1 0 0 0 1 1h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1a.98.98 0 0 0-.383-.768C18.184 8.34 12 3 12 3z" />
            </svg>
            {t("home")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/stars"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Star width="20px" height="20px" fill="#fff" />
            {t("stars")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/premium"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#fff"
            >
              <path d="M5 20v-2h14v2zm0-3.5L3.725 8.475q-.05 0-.113.013T3.5 8.5q-.625 0-1.062-.438T2 7t.438-1.062T3.5 5.5t1.063.438T5 7q0 .175-.038.325t-.087.275L8 9l3.125-4.275q-.275-.2-.45-.525t-.175-.7q0-.625.438-1.063T12 2t1.063.438T13.5 3.5q0 .375-.175.7t-.45.525L16 9l3.125-1.4q-.05-.125-.088-.275T19 7q0-.625.438-1.063T20.5 5.5t1.063.438T22 7t-.437 1.063T20.5 8.5q-.05 0-.112-.012t-.113-.013L19 16.5z" />
            </svg>
            {t("premium")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/referal"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Users width="20px" height="20px" fill="#fff" />
            {t("referal")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 512 512"
              fill="#fff"
            >
              <circle cx="256" cy="256" r="48" />
              <path d="m470.39 300l-.47-.38l-31.56-24.75a16.11 16.11 0 0 1-6.1-13.33v-11.56a16 16 0 0 1 6.11-13.22L469.92 212l.47-.38a26.68 26.68 0 0 0 5.9-34.06l-42.71-73.9a1.59 1.59 0 0 1-.13-.22A26.86 26.86 0 0 0 401 92.14l-.35.13l-37.1 14.93a15.94 15.94 0 0 1-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 0 1-8.19-11.82l-5.59-39.59l-.12-.72A27.22 27.22 0 0 0 298.76 26h-85.52a26.92 26.92 0 0 0-26.45 22.39l-.09.56l-5.57 39.67a16 16 0 0 1-8.13 11.82a175.21 175.21 0 0 0-10 5.82a15.92 15.92 0 0 1-14.43 1.27l-37.13-15l-.35-.14a26.87 26.87 0 0 0-32.48 11.34l-.13.22l-42.77 73.95a26.71 26.71 0 0 0 5.9 34.1l.47.38l31.56 24.75a16.11 16.11 0 0 1 6.1 13.33v11.56a16 16 0 0 1-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 0 0-5.9 34.06l42.71 73.9a1.59 1.59 0 0 1 .13.22a26.86 26.86 0 0 0 32.45 11.3l.35-.13l37.07-14.93a15.94 15.94 0 0 1 14.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 0 1 8.19 11.82l5.56 39.59l.12.72A27.22 27.22 0 0 0 213.24 486h85.52a26.92 26.92 0 0 0 26.45-22.39l.09-.56l5.57-39.67a16 16 0 0 1 8.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0 1 14.43-1.27l37.13 14.95l.35.14a26.85 26.85 0 0 0 32.48-11.34a2.53 2.53 0 0 1 .13-.22l42.71-73.89a26.7 26.7 0 0 0-5.89-34.11Zm-134.48-40.24a80 80 0 1 1-83.66-83.67a80.21 80.21 0 0 1 83.66 83.67Z" />
            </svg>
            {t("settings")}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
