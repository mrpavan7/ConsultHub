import React from "react";
import classes from "./Specialities.module.css";
import Speciality from "./Speciality";
import { ReactComponent as Physician } from "../../../svg/Physician.svg.jsx";
import { ReactComponent as Pediatricians } from "../../../svg/Pediatricians.svg.jsx";
import { ReactComponent as Gynecologist } from "../../../svg/Gynecologist.svg.jsx";
import { ReactComponent as Neurologist } from "../../../svg/Neurologist.svg.jsx";
import { ReactComponent as Dermatologist } from "../../../svg/Dermatologist.svg.jsx";
import { useNavigate } from "react-router-dom";

const Specialities = () => {
  const specialities = [
    { title: "Pediatricians", Icon: Pediatricians },
    { title: "Gynecologist", Icon: Gynecologist },
    { title: "General Physician", Icon: Physician },
    { title: "Neurologist", Icon: Neurologist },
    { title: "Dermatologist", Icon: Dermatologist },
  ];

  const navigate = useNavigate();

  return (
    <div className={`${classes.banner} flex flex-col items-center p-5`}>
      <div
        className={`${classes.SpecialityText} flex flex-col items-center w-2/5`}
      >
        <h1 className="text-6xl font-medium text-white font-outfit ">
          Find By Speciality
        </h1>
        <p className="text-xl font-normal text-center text-white mt-7 font-outfit">
          Simply browse through our extensive list of trusted doctors, schedule
          your appointment hassle-free.
        </p>
      </div>
      <div
        className={`${classes.SpecialitiesContainer} flex flex-row items-center justify-center w-full rounded-full mt-10 gap-10`}
      >
        {specialities.map((speciality, index) => {
          return (
            <Speciality
              key={index}
              title={speciality.title}
              Icon={speciality.Icon}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Specialities;
