import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./DoctorProfile.module.css";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiInfoCircle } from "react-icons/bi";
import { ReactComponent as DocProfileBlob } from "../../../svg/DocProfileBlob.svg";
import { useSelector } from "react-redux";

const DoctorProfile = () => {
  const selectedDoctor = useSelector((state) => state.doctors.selectedDoctor);

  useEffect(() => {
    const scrollableDiv = document.querySelector(".scrollable-div");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);

    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  const navigate = useNavigate();
  console.log(selectedDoctor);
  const isLogin = useSelector((state) => state.auth.isLoggedIn);

  const handleBookAppointment = () => {
    if (isLogin) {
      navigate("./appointment-form");
    } else {
      alert("Please Sign-in to book appointment");
      navigate("/sign-in");
    }
  };

  return (
    <div className={`${classes.banner} flex flex-row items-center`}>
      <div
        className={`${classes.textContainer} h-3/4 w-2/3 bg-[#B3E5F6] flex rounded-tr-full rounded-br-full items-center justify-center`}
      >
        <div className="flex flex-col items-start justify-center w-2/3 h-full ">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-medium text-[#0075bc]">
              {selectedDoctor.name}
            </h1>
            <RiVerifiedBadgeFill className="text-[#0075bc] text-3xl mt-1" />
          </div>
          <div className="flex flex-row items-center gap-2 mt-4">
            <p className="text-[#4B5563] text-[1.3rem]">
              {selectedDoctor.education} - {selectedDoctor.speciality}
            </p>
            <div>
              <p className="text-[#0075bc] rounded-full text-base border border-[#0075bc] px-2 py-1 mt-1">
                {selectedDoctor.experience} years
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-[0.4rem] mt-7">
            <p className="text-lg font-bold">About</p>
            <BiInfoCircle className="text-lg stroke-[0.6] text-black mt-[0.11rem]" />
          </div>
          <p
            className={` ${classes.noScrollbar} scrollable-div flex overflow-y-scroll h-[20vh] text-lg`}
          >
            {selectedDoctor.about}
          </p>
          <p className="text-xl font-bold text-[#4b5563] mt-7">
            Appointment fee :{" "}
            <span className="text-[#0075bc] ml-1">
              ${selectedDoctor.appointmentFee}
            </span>
          </p>
          <button
            className="text-xl font-bold text-white bg-[#0075bc] p-2 px-4 rounded-lg mt-3"
            onClick={handleBookAppointment}
          >
            Book Appointment
          </button>
        </div>
      </div>
      <div
        className={`${classes.imageContainer} h-3/4 w-2/5 flex items-center relative mb-10`}
      >
        <DocProfileBlob className="absolute bottom-5 h-4/5" />
        <img src={selectedDoctor.photo} alt="" className="absolute z-10" />
      </div>
    </div>
  );
};

export default DoctorProfile;
