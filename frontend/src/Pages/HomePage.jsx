import React from "react";
import Hero from "../Components/HomePage/Hero/Hero";
import Specialities from "../Components/HomePage/Specialities/Specialities";
import TopDoctors from "../Components/HomePage/TopDoctors/TopDoctors";
import Reminder from "../Components/HomePage/Reminder/Reminder";
import Popup from "../Components/Popup/Popup";

const HomePage = () => {
  return (
    <div className={`pt-10`}>
      <Hero />
      <Specialities />
      <TopDoctors />
      <Reminder />
    </div>
  );
};

export default HomePage;
