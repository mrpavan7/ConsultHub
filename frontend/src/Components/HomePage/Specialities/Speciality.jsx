import React from "react";
import classes from "./Speciality.module.css";
import { useNavigate } from "react-router-dom";
import { getLenisInstance } from "../../ScrollToTop/SmoothScroll";

const Speciality = ({ Icon, title }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const lenis = getLenisInstance(); // Get the Lenis instance
    if (lenis) {
      lenis.scrollTo(0, {
        immediate: false, // Ensures smooth scrolling
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback
    }

    // Allow a slight delay to finish scrolling before navigating
    setTimeout(() => {
      navigate(`/doctors`, { state: title });
    }, 0); // Adjust delay as needed
  };

  return (
    <div
      className={`${classes.banner} group flex flex-col items-center relative top-5 hover:cursor-pointer`}
      onClick={handleClick}
    >
      <div
        className={`${classes.Speciality} flex items-center justify-center aspect-square rounded-full`}
      >
        {Icon ? <Icon style={{ height: "70%" }} /> : null}
      </div>
      <p
        className="text-xl font-medium group-hover:font-bold group-hover:text-2xl"
        style={{ color: "#0075BC", transition: "0.5s ease" }}
      >
        {title}
      </p>
    </div>
  );
};

export default Speciality;
