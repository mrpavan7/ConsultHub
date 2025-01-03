import React, { useEffect, useState } from "react";
import DoctorCard from "../DoctorCard/DoctorCard";
import Loading from "../../LoadingPage/Loading";

import {
  CardBlob1,
  CardBlob2,
  CardBlob3,
  CardBlob4,
  CardBlob5,
  CardBlob6,
  CardBlob7,
} from "../../../svg/CardBlobs";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedDoctor,
  fetchDoctors,
} from "../../../features/doctors/doctors.slice";

const AllDoctors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryPassed = location.state || {}; // Extract category from location state

  const dispatch = useDispatch();
  const { status, error, doctors } = useSelector((state) => state.doctors); // Fetch state from Redux store

  const [activeIndex, setActiveIndex] = useState(0); // State to manage selected specialty tab
  const [initialLoad, setInitialLoad] = useState(true); // Track if it's the first load

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Set the activeIndex from categoryPassed only on initial load
    if (initialLoad && categoryPassed) {
      switch (categoryPassed) {
        case "GeneralPhysician":
          setActiveIndex(0);
          break;
        case "Gynecologist":
          setActiveIndex(1);
          break;
        case "Dermatologist":
          setActiveIndex(2);
          break;
        case "Pediatricians":
          setActiveIndex(3);
          break;
        case "Neurologist":
          setActiveIndex(4);
          break;
        case "Gastroenterologist":
          setActiveIndex(5);
          break;
        default:
          setActiveIndex(0); // Default to General Physician if no category passed
      }
      setInitialLoad(false); // Prevent future resets from categoryPassed
    }
  }, [categoryPassed, initialLoad]); // Only run on categoryPassed or initialLoad change

  // Blobs for card background
  const cardBlobs = [
    CardBlob1,
    CardBlob2,
    CardBlob3,
    CardBlob4,
    CardBlob5,
    CardBlob6,
    CardBlob7,
  ];

  const navigateToProfile = (doctor) => {
    dispatch(addSelectedDoctor(doctor));
    navigate("/doctors/doctor-profile");
  };

  const random = () => Math.floor(Math.random() * cardBlobs.length); // Randomly select card blob

  const specialities = [
    "General Physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  // Handle loading and error states
  if (status === "pending") {
    return <Loading />;
  }

  if (status === "error") {
    return <p>Error loading doctors: {error}</p>;
  }

  // Access the doctors array under doctors.data
  const doctorsData = doctors || [];

  // Filter doctors based on selected specialty
  const filteredDoctors = doctorsData.filter((doctor) => {
    const selectedSpeciality = specialities[activeIndex];
    return doctor.speciality === selectedSpeciality;
  });

  return (
    <div className="flex flex-col items-center mt-20 min-h-lvh">
      <div className="w-[90%] bg-white h-[3rem] rounded-t-2xl flex flex-row items-center justify-around">
        {specialities.map((speciality, index) => (
          <p
            key={index}
            className={`${
              activeIndex === index
                ? "bg-[#65AED8] text-white"
                : "bg-white text-[#4B5563] hover:bg-[#d4edffa4]"
            } pb-3 px-6 pt-1 font-outfit font-medium text-2xl mt-4 rounded-t-2xl cursor-pointer`}
            onClick={() => setActiveIndex(index)} // This will change the active index on click
          >
            {speciality}
          </p>
        ))}
      </div>

      <div className="w-[95%] min-h-[90vh] rounded-t-3xl bg-[#65AED8]">
        <div className="grid mt-20 pb-20 px-5 gap-y-10 [grid-template-columns:repeat(auto-fit,_minmax(18rem,_1fr))] justify-items-center">
          {filteredDoctors.length === 0 ? (
            <p>No doctors found for this specialty.</p>
          ) : (
            filteredDoctors.map(
              (doctor, index) =>
                doctor && (
                  <DoctorCard
                    key={index}
                    CardBlob={cardBlobs[random()]}
                    doctorData={doctor}
                    navigateToProfile={navigateToProfile}
                  />
                )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
