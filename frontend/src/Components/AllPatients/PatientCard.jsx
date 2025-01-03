import React, { useEffect, useState } from "react";
import defaultProfile from "../../assets/userDefaultProfile.svg";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const PatientCard = ({ patientId, rating, feedback }) => {
  useEffect(() => {
    const scrollableDiv = document.querySelector(".noScrollbar");
    const scrollableDiv2 = document.querySelector(".scrollableDiv");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);
    scrollableDiv2.addEventListener("wheel", stopPropagation);
    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
      scrollableDiv2.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  const [patientDetails, setPatientDetails] = useState({
    photo: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchUser = async (patientId) => {
    const uid = patientId;
    if (!uid) return;
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/users/" + uid
      );
      return response?.data?.data;
    } catch (error) {
      console.error("Failed to fetch user", error.message);
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      if (!patientId) return;
      const user = await fetchUser(patientId);
      if (user) {
        setPatientDetails({
          photo: user.photo || "",
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
      }
    };
    getUserDetails();
  }, [patientId]);

  const handleContact = () => {
    if (patientDetails.email) {
      const subject = encodeURIComponent("Follow-Up from Your Doctor");
      const body = encodeURIComponent(
        `Dear ${
          patientDetails.name || "Patient"
        },\n\nI hope this message finds you well. I wanted to follow up regarding your recent appointment and ensure everything is going smoothly.\n\nIf you have any questions or concerns, please feel free to reply to this email or contact me directly.\n\nBest regards,\nDr. [Doctor's Name]`
      );
      window.location.href = `mailto:${patientDetails.email}?subject=${subject}&body=${body}`;
    } else {
      alert("No email address provided for this patient.");
    }
  };

  return (
    <div className="bg-[#65AED8] border-4 border-[#0075BC] w-[24rem] rounded-[5rem] h-[29rem] mb-24 relative p-5 flex flex-col items-center">
      <div className="bg-[#0075BC] h-[100px] aspect-square rounded-full absolute top-[-50px] border-2 border-[#0075BC]">
        <img
          src={patientDetails.photo ? patientDetails.photo : defaultProfile}
          alt="Patient Profile"
          className="w-full rounded-full aspect-square"
        />
      </div>
      <h2 className="mt-10 text-2xl font-bold text-white">
        {patientDetails.name ? patientDetails.name : "Patient Name"}
      </h2>
      <div className="w-[95%] h-full mt-2">
        <h2 className="text-xl font-bold text-[#0075BC] mb-3">
          Contact Details
        </h2>
        <div className="flex w-full gap-2 font-medium">
          <div className="flex justify-between w-[25%] text-white font-bold ">
            <p>Email</p>
            <p>:</p>
          </div>
          <p className="text-[#004A76]">
            {" "}
            {patientDetails.email ? patientDetails.email : "Not Provided"}
          </p>
        </div>
        <div className="flex w-full gap-2 font-medium">
          <div className="flex justify-between w-[25%] text-white font-bold ">
            <p>Phone</p>
            <p>:</p>
          </div>
          <p className="text-[#004A76]">
            {patientDetails.phone ? patientDetails.phone : "Not Provided"}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex justify-between w-[25%] text-white font-bold ">
            <p>Address</p>
            <p>:</p>
          </div>
          <p className="text-sm font-medium h-[4rem] w-[75%] text-white noScrollbar overflow-y-scroll">
            {patientDetails.address ? patientDetails.address : "Not Provided"}
          </p>
        </div>
        <div className="flex items-center w-full gap-2 mt-3 font-medium">
          <div className="flex gap-2 w-[50%] text-[#0075BC] text-xl font-bold ">
            <p>Patient Review</p>
            <p>:</p>
          </div>
          {Array(5)
            .fill()
            .map((_, index) => {
              const starValue = index + 1;
              return (
                <FaStar
                  key={starValue}
                  className={`text-xl ${
                    starValue <= rating ? "text-[#0075BC]" : "text-white"
                  }`}
                />
              );
            })}
        </div>
        <div className="flex justify-between w-[20%] text-lg text-[#0075BC] font-bold ">
          <p>Feedback</p>
          <p>:</p>
        </div>
        <p className="text-sm font-medium h-[4rem] text-white noScrollbar scrollableDiv overflow-y-scroll">
          {feedback ? feedback : "Not Provided"}
        </p>

        <div className="flex justify-center">
          <button
            className="bg-[#0075BC] text-white font-bold py-1 px-3 mt-5 rounded-lg"
            onClick={handleContact}
            disabled={!patientDetails.email}
          >
            Contact Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
