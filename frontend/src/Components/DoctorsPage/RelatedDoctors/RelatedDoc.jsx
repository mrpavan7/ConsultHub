import React, { useEffect } from "react";
import classes from "./RelatedDoc.module.css";
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
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedDoctor,
  fetchDoctors,
} from "../../../features/doctors/doctors.slice";
import { useNavigate } from "react-router-dom";

const RelatedDoctor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, status, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  const selectedDoctor = useSelector((state) => state.doctors.selectedDoctor);

  const cardBlobs = [
    CardBlob1,
    CardBlob2,
    CardBlob3,
    CardBlob4,
    CardBlob5,
    CardBlob6,
    CardBlob7,
  ];

  const random = () => Math.floor(Math.random() * cardBlobs.length);

  if (status === "pending") {
    return <Loading />;
  }

  if (status === "error") {
    return <p>Error loading doctors: {error}</p>;
  }

  const doctorsData = doctors || [];

  // Filter and limit doctors to 8 with the same specialty as selectedDoctor
  const relatedDoctors = doctorsData
    .filter((doctor) => {
      const isSameSpeciality =
        doctor.speciality?.toLowerCase() ===
        selectedDoctor?.speciality?.toLowerCase();
      const isNotSelectedDoctor = doctor.doctorId !== selectedDoctor?.doctorId;
      return isSameSpeciality && isNotSelectedDoctor;
    })
    .slice(0, 8);

  const navigateToProfile = (doctor) => {
    dispatch(addSelectedDoctor(doctor));
    navigate("/doctors/doctor-profile");
  };

  return (
    <div className={`${classes.banner} `}>
      <div className={`${classes.textContainer} flex flex-col items-center`}>
        <h1 className="text-5xl font-medium text-white">Related Doctors</h1>
        <p className="text-xl font-normal text-white">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>
      <div className="grid mt-20 pb-20 gap-y-10 [grid-template-columns:repeat(auto-fit,_minmax(18rem,_1fr))] justify-items-center">
        {relatedDoctors.length > 0 ? (
          relatedDoctors.map((doctor, index) => (
            <DoctorCard
              key={index}
              CardBlob={cardBlobs[random()]}
              doctorData={doctor}
              navigateToProfile={navigateToProfile}
            />
          ))
        ) : (
          <p className="text-lg text-white">No related doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedDoctor;
