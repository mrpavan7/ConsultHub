import React, { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { getLenisInstance } from "./SmoothScroll";

const ScrollToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const lenis = getLenisInstance();

    if (lenis) {
      lenis.scrollTo(0, {
        immediate: false,
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed z-30 w-10 h-10 rounded-full bottom-10 right-10 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <IoIosArrowUp className="w-full h-full text-[#0075BC] cursor-pointer" />
    </div>
  );
};

export default ScrollToTopBtn;
