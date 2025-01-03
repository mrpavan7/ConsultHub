import React from "react";
import classes from "./Hero.module.css";
import { ReactComponent as HeroBlob } from "../../../svg/HeroBlob.svg.jsx";
import { ReactComponent as HeroImage } from "../../../svg/HeroImage.svg.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Hero = () => {
  const navigate = useNavigate();

  const isLogin = useSelector((state) => state.auth.isLoggedIn);

  const handleClick = () => {
    if (isLogin) {
      navigate("/doctors");
    } else {
      alert("Please Sign-in to book appointment");
      navigate("/sign-in");
    }
  };

  return (
    <div className={`${classes.banner} relative flex flex-row `}>
      <div
        className={`${classes.halfCircle} absolute aspect-square rounded-full`}
      ></div>
      <div
        className={`${classes.heroText} cursor-default z-10 h-fit ml-10 mt-16`}
      >
        <h1 className="font-bold text-white text-7xl">
          Personalized Healthcare at Your Fingertips
        </h1>
        <p className="mt-5 text-2xl font-normal text-white">
          ...Simply browse through our extensive list of trusted doctors,
          schedule your appointment hassle-free.
        </p>
        <div
          className={`${classes.bookBtn} text-white flex items-center justify-center mt-5 w-fit px-5 py-3 rounded-xl`}
        >
          <button className="font-semibold " onClick={handleClick}>
            Book Appointment
          </button>
        </div>
      </div>
      <div
        className={`${classes.heroBlobContainer} mr-24 grid place-items-center`}
      >
        <div
          className={`${classes.heroBlob} row-start-1 row-end-2 col-start-1 col-end-2`}
        >
          <HeroBlob width={570} />
        </div>
        <div
          className={`${classes.heroImage} row-start-1 row-end-2 col-start-1 col-end-2`}
        >
          <HeroImage />
        </div>
      </div>
    </div>
  );
};

export default Hero;
