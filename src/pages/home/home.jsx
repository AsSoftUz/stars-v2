import './home.scss'
import duck from '../../assets/duck.gif'
import starsIcon from '../../assets/starsIcon.png'
import starsImg from '../../assets/stars.png'
import premiumImg from '../../assets/premium.png'
import premiumIcon from '../../assets/premiumIcon.png'
import homeIcon from '../../assets/homeIcon.png'
import referalIcon from '../../assets/referalIcon.png'
import settingsIcon from '../../assets/settingsIcon.png'
import Nav from '../nav/nav.jsx'

const Home = () => {
    return (
        <div className="home">
            <div className="hero">
                <h1>
                    Xush kelibsiz!
                    <img src={duck} alt="" width='44px' />
                </h1>
                <p>Aziz foydalanuvchi...</p>
            </div>
            <div className="main-cards">
                <div className="pcard">
                    <div className="card">
                        <div className="left">
                            <h2>
                                <img src={starsIcon} alt="" />
                                Stars
                            </h2>
                            <p>Visa kartasiz tez va qulay usulda Stars harid qiling!</p>
                        </div>
                        <div className="right">
                            <img src={starsImg} alt="" />
                        </div>
                    </div>
                    <a href="#">
                        <img src={starsIcon} alt="" width='20px' height='20px' />
                        Stars sotib olish
                    </a>
                </div>
                <div className="pcard">
                    <div className="card">
                        <div className="left">
                            <h2>
                                <img src={premiumIcon} alt="" />
                                Premium
                            </h2>
                            <p>Visa kartasiz tez va qulay usulda telegram premium obunasini harid qiling!</p>
                        </div>
                        <div className="right">
                            <img src={premiumImg} alt="" />
                        </div>
                    </div>
                    <a href="#">
                        <img src={premiumIcon} alt="" width='20px' height='20px' />
                        Premium sotib olish
                    </a>
                </div>
            </div>
            <Nav />
            {/* <nav>
                <ul>
                    <li>
                        <a href="">
                            <img src={homeIcon} alt="" />
                            Bosh Sahifa
                        </a>
                    </li>
                    <li>
                        <a href="">
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
            </nav> */}
        </div> 
    )
}

export default Home;