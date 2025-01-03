import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

let lenis; // Declare lenis instance globally

const initializeSmoothScroll = () => {
  lenis = new Lenis({
    duration: 1.2, // smoothness duration
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing function
    smooth: true,
    wrapper: document.querySelector("body"), // Apply Lenis to the entire body
    content: document.querySelector("body"), // Apply Lenis to the entire body
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    normalizeWheel: true,
    gestureDirection: "vertical",
    wrapperClass: "lenis-wrapper",
    contentClass: "lenis-content",
    ignore: (el) => el.classList.contains("no-lenis-scroll"), // Exclude elements with this class
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);

  return () => {
    lenis.destroy();
  };
};

export const useSmoothScroll = () => {
  useEffect(() => {
    const cleanup = initializeSmoothScroll();
    return cleanup;
  }, []);
};

export const getLenisInstance = () => lenis; // Export the instance
