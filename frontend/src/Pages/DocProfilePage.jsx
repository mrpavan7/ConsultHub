import React from "react";
import DoctorProfile from "../Components/DoctorsPage/DoctorProfile/DoctorProfile";
import RelatedDoctor from "../Components/DoctorsPage/RelatedDoctors/RelatedDoc";

const DocProfilePage = () => {
  return (
    <div>
      <DoctorProfile />
      <RelatedDoctor />
    </div>
  );
};

export default DocProfilePage;
