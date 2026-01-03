import homeIcon from "../../assets/homeIcon.png";
import premiumIcon from "../../assets/premiumIcon.png";
import referalIcon from "../../assets/referalIcon.png";
import settingsIcon from "../../assets/settingsIcon.png";
import starsIcon from "../../assets/starsIcon.png";
import './nav.scss';

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">
            <img src={homeIcon} alt="" />
            Bosh Sahifa
          </a>
        </li>
        <li>
          <a href="stars">
            <img src={starsIcon} alt="" />
            Stars
          </a>
        </li>
        <li>
          <a href="">
            <img src={premiumIcon} alt="" />
            Premium
          </a>
        </li>
        <li>
          <a href="">
            <img src={referalIcon} alt="" />
            Referal
          </a>
        </li>
        <li>
          <a href="">
            <img src={settingsIcon} alt="" />
            Sozlamalar
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;