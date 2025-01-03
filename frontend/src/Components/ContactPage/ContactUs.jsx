import React from "react";
import { ContactUsPic } from "../../svg/ContactUsPic.svg";
import { ContactUsBlob } from "../../svg/ContactUsBlob.svg";

const ContactUs = () => {
  return (
    <div className="h-[90vh] w-full flex flex-row">
      <div className="relative w-1/2 h-full right-10 ">
        <div className="flex items-end h-full ">
          <ContactUsPic className="h-[90%] z-20" />
        </div>
        <div className="h-[25%] z-10 rounded-r-full transform rotate-[30deg] absolute top-[48%] left-[-15%] w-full bg-[#B3E5F6]"></div>
      </div>
      <div className="relative w-1/2 h-full">
        <ContactUsBlob className="absolute top-[20%] left-[-7%] z-10 w-[90%]" />
        <div className="flex flex-col items-center w-full h-full gap-10 pt-[10%]">
          <h1 className="w-[80%] text-[2.5rem] font-bold font-inter text-white mb-10 z-20">
            Contact Us
          </h1>
          <div className="w-[80%] z-20">
            <h2 className="text-2xl font-bold font-outfit text-[#0075BC] mb-4">
              Our Office
            </h2>
            <p className="text-xl text-[#4B5563] font-normal font-outfit mb-2">
              54709 Willms Station Suite 350, Washington, USA
            </p>
            <p className="text-xl text-[#4B5563] font-normal font-outfit mb-2">
              <span className="font-bold">Tel :</span> (415) 555‑0132
            </p>
            <p className="text-xl text-[#4B5563] font-normal font-outfit mb-2">
              <span className="font-bold">Email :</span>{" "}
              <a href="mailto:projectinfinityhq@gmail.com">
                projectinfinityhq@gmail.com
              </a>
            </p>
          </div>
          <div className="w-[80%] z-20">
            <h2 className="text-2xl font-bold font-outfit text-[#0075BC] mb-4">
              Careers At ConsultHub
            </h2>
            <div className="text-xl text-[#4B5563] font-normal font-outfit flex flex-col gap-2 w-[70%]">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
                cumque, amet deserunt voluptate earum commodi. Rem aspernatur
                impedit mollitia. Fuga quisquam voluptatum ea vitae repudiandae
                vel cumque odit delectus incidunt?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
