import React, { useEffect, useState } from "react";
import classes from "./DoctorCard.module.css";
import { GoDotFill } from "react-icons/go";
import defaultDoctorImage from "../../../assets/defaultDoctorImage.png";
import axios from "axios";

const DoctorCard = ({ CardBlob, doctorData, navigateToProfile }) => {
  const [availability, setAvailability] = useState(null);

  const checkAvailability = (slots) => {
    if (!slots || slots.length === 0) return false;

    const sortedSlots = [...slots].sort();
    const firstSlot = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    return currentTime >= firstSlot && currentTime <= lastSlot;
  };

  const fetchDoctor = async (doctorId) => {
    if (!doctorId) return;
    try {
      const params = { doctorId };
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/doctors/fetch-doctor",
        { params }
      );
      const doctor = response.data.doctor[0];
      setAvailability(checkAvailability(doctor.dailySlots));
    } catch (error) {
      console.error("Failed to fetch doctor.", error.message);
    }
  };

  useEffect(() => {
    if (doctorData?.doctorId) {
      fetchDoctor(doctorData.doctorId);
    }
  }, [doctorData]);
  if (!doctorData) return null;

  return (
    <div className="w-fit h-[60vh]">
      <div
        className={`${classes.banner} h-[52vh] bg-[#B3E5F6] min-w-[17rem] w-[18vw] rounded-[2rem] flex flex-col items-center relative`}
      >
        <div className="absolute flex items-center justify-center w-full  h-[80%]">
          {CardBlob && <CardBlob className="h-[80%] absolute z-0" />}
        </div>
        <div className="absolute bottom-[14%] z-10">
          <img
            src={
              doctorData.photo === "/src/assets/defaultDoctorImage.png"
                ? defaultDoctorImage
                : doctorData.photo
            }
            alt={doctorData.name || "Doctor"}
          />
        </div>
        <div
          className={`${classes.cardText} w-[85%] z-10 cursor-pointer hover:border-2 hover:border-[#0075BC] bg-[#E0F6FF] h-[30%] rounded-3xl absolute bottom-[-15%] flex flex-col justify-center`}
          onClick={() => navigateToProfile(doctorData)}
        >
          <h1 className="text-xl font-medium text-[#262626] ml-9">
            {doctorData.name || "Doctor Name"}
          </h1>
          <p className="text-base text-[#5c5c5c] ml-9">
            {doctorData.speciality || "Speciality"}
          </p>
          {availability ? (
            <div className="flex items-center ml-9">
              <GoDotFill className="text-[#0FBF00]" />
              <p className="text-[#0FBF00] text-base">Available</p>
            </div>
          ) : (
            <div className="flex items-center ml-9">
              <GoDotFill className="text-[#BF0000]" />
              <p className="text-[#BF0000] text-base">Not Available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
