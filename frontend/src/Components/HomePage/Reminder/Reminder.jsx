import React from "react";
import reminderImage from "../../../assets/reminderImage.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Reminder = () => {
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
    <div className="h-[60vh] mb-10 flex items-center gap-20 relative">
      <div className="h-[85%] w-[65%] rounded-r-full bg-[#B3E5F6] relative -left-10 flex flex-col justify-center pl-16">
        <h1 className="text-6xl font-bold leading-[6rem] text-[#0075bc]">
          Book Appointment <br /> With 100+ Trusted Doctors
        </h1>
        <div
          className={`text-white flex items-center justify-center bg-[#0075bc] transition-colors duration-300 text-[24px] hover:bg-[#529cc7] mt-5 w-fit px-5 py-3 rounded-xl`}
        >
          <button className="font-semibold " onClick={handleClick}>
            Book Appointment
          </button>
        </div>
      </div>
      <div className="h-[90%] aspect-square rounded-full bg-[#B3E5F6]"></div>
      <img
        src={reminderImage}
        alt=""
        className=" absolute h-[100%] right-0 pr-5 -bottom-10"
      />
    </div>
  );
};

export default Reminder;
