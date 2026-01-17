import Lottie from "lottie-react";
import animationData from "../../assets/loaderGif.json";
import "./loader.scss";

const Loader = ({ onFinished }) => {
  return (
    <div className="home-loading">
      <Lottie 
        animationData={animationData} 
        loop={false} // Bir marta to'liq aylanishi uchun
        onComplete={onFinished} // Animatsiya tugashi bilan funksiyani chaqiradi
        style={{ width: "250px", height: "250px" }}
      />
    </div>
  );
};

export default Loader;