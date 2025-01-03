import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import defaultDoctorImage from "../../assets/defaultDoctorImage.png";
import doctorProfileBlob from "../../assets/doctorProfileBlob.svg";
import { ImInfo } from "react-icons/im";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import classes from "./DoctorProfile.module.css";
import { useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  useEffect(() => {
    const scrollableDiv = document.querySelector(".scrollableDiv");
    const scrollableDiv2 = document.querySelector(".scrollableDiv2");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);
    scrollableDiv2.addEventListener("wheel", stopPropagation);

    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
      scrollableDiv2.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  const user = useSelector((state) => state.auth.user);
  const doctors = useSelector((state) => state.doctors.doctors);
  const currentDoctor = doctors.find((doctor) => doctor.doctorId === user.uid);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center h-[120vh]">
      <div className="w-[70%] min-w-[50rem] h-[50%] relative flex">
        <div className="flex justify-center w-[27%] rounded-t-[10%] self-end h-[80%] bg-[#529CC7] ">
          <img
            src={user.photo ? user.photo : defaultDoctorImage}
            className=""
            alt=""
          />
        </div>
        <div className="w-[70%] flex flex-col gap-3 ml-8 self-end justify-center h-[90%] z-20 pl-24 pt-12">
          <div className="flex items-center gap-3 text-3xl font-bold text-white">
            <h1>{user.name ? user.name : "Doctor Name"}</h1>
            <RiVerifiedBadgeFill className="text-[#004A76]" />
          </div>
          <div className="flex items-center gap-3 text-[#4B5563] text-lg font-outfit font-semibold">
            <p>{user.education ? user.education : "Education"},</p>
            <p>{user.speciality ? user.speciality : "Speciality"}</p>
            <p className="border-2 border-[#004A76] rounded-full px-2 py-1 text-[#004A76]">
              {user.experience ? user.experience : "0"} years
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex justify-between w-[15%] text-xl font-semibold text-[#004A76]">
              <p className="">Email Id</p>
              <p>:</p>
            </div>
            <p className="text-xl text-white font-outfit">
              {currentDoctor?.email ? currentDoctor.email : "Email Id"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex justify-between w-[15%] text-xl font-semibold text-[#004A76]">
              <p className="">Phone</p>
              <p>:</p>
            </div>
            <p className="text-xl text-white font-outfit">
              {user.phone ? user.phone : "Phone"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex justify-between self-start w-[15%] text-xl font-semibold text-[#004A76]">
              <p className="">Address</p>
              <p>:</p>
            </div>
            <p
              className={`${classes.noScrollbar} scrollableDiv2 overflow-y-scroll text-xl text-white font-outfit max-h-[10.5rem] mb-6 self-start w-[70%]`}
            >
              {user.address ? user.address : "Address"}
            </p>
          </div>
        </div>
        <img
          src={doctorProfileBlob}
          className="absolute w-[70%] h-[170%] right-0"
          alt=""
        />
      </div>
      <div className="w-[77%] z-10 h-[50%]">
        <div className="w-full p-10 h-[80%] bg-[#B3E5F6] rounded-3xl">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#004A76]">About</h2>
            <ImInfo className="text-2xl text-[#004A76]" />
          </div>
          <div
            className={`${classes.noScrollbar} scrollableDiv w-full overflow-y-scroll h-[80%] mt-5`}
          >
            <p className="text-lg font-semibold font-outfit text-[#4B5563]">
              {user.about ? user.about : "About information not provided"}
            </p>
          </div>
        </div>
        <div className="w-full h-[20%] flex justify-center items-center">
          <button
            className="px-10 text-xl font-bold text-white py-3 rounded-xl bg-[#004A76]"
            onClick={() => navigate("./doctor-form")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
