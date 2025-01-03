import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenisInstance } from "./SmoothScroll";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const lenis = getLenisInstance(); // Get the Lenis instance
    if (lenis) {
      lenis.scrollTo(0, {
        immediate: false, // Ensures smooth scrolling
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Fallback
    }
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
