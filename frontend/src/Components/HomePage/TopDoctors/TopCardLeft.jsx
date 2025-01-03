import React, { useEffect, useState } from "react";
import classes from "./TopCard.module.css";
import { GoDotFill } from "react-icons/go";
import defaultDoctorImage from "../../../assets/defaultDoctorImage.png";
import { useDispatch } from "react-redux";
import { addSelectedDoctor } from "../../../features/doctors/doctors.slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TopCardLeft = ({ pic, name, speciality, doctor, doctorId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [availability, setAvailability] = useState(null);

  const navigateToProfile = (doctor) => {
    if (!doctor) return;

    const doctorData = {
      doctorId: doctor.uid,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      photo: doctor.photo,
      education: doctor.education,
      experience: doctor.experience,
      speciality: doctor.speciality,
      appointmentFee: doctor.appointmentFee,
      availability: doctor.availability,
      about: doctor.about,
      address: doctor.address,
      dailySlots: doctor.dailySlots || [],
    };

    dispatch(addSelectedDoctor(doctorData));
    navigate("/doctors/doctor-profile");
  };

  const checkAvailability = (slots) => {
    if (!slots || slots.length === 0) return false;

    // Sort slots in ascending order
    const sortedSlots = [...slots].sort();
    const firstSlot = sortedSlots[0];
    const lastSlot = sortedSlots[sortedSlots.length - 1];

    // Get current time in HH:mm format
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    // Check if current time falls between first and last slot
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
    fetchDoctor(doctorId);
  }, [doctorId]);

  return (
    <div className={`${classes.banner} ml-14 grid h-full w-1/2`}>
      <div className="z-20 col-start-1 col-end-2 row-start-1 row-end-2 w-fit">
        <img
          src={pic ? pic : defaultDoctorImage}
          alt=""
          style={{ height: "19rem" }}
          className=" scale-x-[-1]"
        />
      </div>
      <div
        className={`${classes.cardText} flex flex-row justify-end col-start-1 col-end-2 row-start-1 z-10 row-end-2 rounded-2xl bg-white`}
      >
        <div className="flex flex-col w-3/5 h-full gap-1 pl-5 mt-5 font-outfit">
          <h1 className="text-3xl font-medium text-[#0075BC]">
            {name ? name : "Doctor Name"}
          </h1>
          <p className="text-xl font-normal text-[#4B5563]">
            {speciality ? speciality : "Speciality"}
          </p>
          {availability ? (
            <div className="flex flex-row items-center text-[#0FBF00]">
              <GoDotFill fill="#0FBF00" />
              <p>Available</p>
            </div>
          ) : (
            <div className="flex flex-row items-center text-[#bf0000]">
              <GoDotFill fill="#bf0000" />
              <p>Not Available</p>
            </div>
          )}

          <button
            className="self-end mt-2 mr-10 text-lg font-medium text-white rounded-lg w-28 h-9 bg-[#0075BC] hover:bg-[#65AED8] hover:text-[#ffffff] transition"
            onClick={() => navigateToProfile(doctor)}
          >
            <p className="font-outfit">Book Now</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopCardLeft;
