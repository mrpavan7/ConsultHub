import React from "react";
import { useNavigate } from "react-router-dom";
import pageNotFoundImage from "../assets/404image.svg";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] pb-10 px-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl">
        <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-[#0075BC] opacity-10"></div>
        <div className="absolute bottom-[-30px] right-[-30px] w-[150px] h-[150px] rounded-full bg-[#B3E5F6] opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="w-full md:w-[120%] transition-transform duration-300 transform">
            <img
              src={pageNotFoundImage}
              alt="404 Illustration"
              className="w-full max-w-[500px] drop-shadow-2xl"
            />
          </div>

          <div className="w-full space-y-6 text-center md:w-full md:text-left">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-white font-outfit animate-slideDown">
                4<span className="text-[#B3E5F6]">0</span>4
              </h1>
              <h2 className="text-4xl font-bold text-white font-outfit">
                Oops! Page Not Found
              </h2>
              <p className="text-xl text-[#B3E5F6] font-outfit leading-relaxed">
                The page you're looking for seems to have gone missing. Don't
                worry, these things happen to the best of us!
              </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <button
                onClick={() => navigate("/")}
                className="bg-[#0075BC] text-white px-6 py-3 rounded-lg font-medium 
                hover:bg-[#005a91] transition-all duration-300 font-outfit
                hover:shadow-[0_0_15px_rgba(0,117,188,0.3)]"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-[#B3E5F6] text-[#0075BC] px-6 py-3 rounded-lg font-medium 
                hover:bg-[#8ed1ec] transition-all duration-300 font-outfit
                hover:shadow-[0_0_15px_rgba(179,229,246,0.3)]"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
