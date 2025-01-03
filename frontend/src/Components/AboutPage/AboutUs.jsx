import React from "react";
import { AboutUsPic } from "../../svg/AboutUsPic.svg";
import { AboutUsBlob } from "../../svg/AboutUsBlob.svg";

const AboutUs = () => {
  return (
    <div className="flex flex-row w-full  h-[90vh] mt-20 ">
      <div className="flex flex-col items-center w-1/2 pt-10 gap-7">
        <div className="w-[22.5%] absolute left-0 bg-[#0075BC] rounded-r-full">
          <h1 className="text-[3rem] font-bold font-outfit ml-10 text-right w-4/5 text-white">
            About Us
          </h1>
        </div>
        <p className="w-4/5 m-[15%] text-2xl font-normal text-white font-outfit">
          Welcome to ConsultHub, your trusted partner in managing your
          healthcare needs conveniently and efficiently. At ConsultHub, we
          understand the challenges individuals face when it comes to scheduling
          doctor appointments and managing their health records. <br />
          <br /> ConsultHub is committed to excellence in healthcare technology.
          We continuously strive to enhance our platform, integrating the latest
          advancements to improve user experience and deliver superior service.
          Whether you're booking your first appointment or managing ongoing
          care, ConsultHub is here to support you every step of the way.
        </p>
      </div>

      <div className="grid w-1/2 place-items-center">
        <div className="h-full col-start-1 col-end-2 row-start-1 row-end-2">
          <AboutUsBlob className="h-[100%]" />
        </div>
        <div className="col-start-1 col-end-2 row-start-1 row-end-2">
          <AboutUsPic className={"h-[47vh] ml-14"} />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
