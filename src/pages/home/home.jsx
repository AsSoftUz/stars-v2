import './home.scss'
import duck from '../../assets/duck.gif'
import starsIcon from '../../assets/starsIcon.png'
import starsImg from '../../assets/stars.png'

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
                <div className="card">
                    <div className="left">
                        <h2>
                            <img src={starsIcon} alt="" />
                            Telegram Stars
                        </h2>
                        <p>Visa kartasiz tez va qulay usulda Stars harid qiling!</p>
                    </div>
                    <div className="right">
                        <img src={starsImg} alt="" />
                    </div>
                </div>
            </div>
            <nav></nav>
        </div> 
    )
}

export default Home;