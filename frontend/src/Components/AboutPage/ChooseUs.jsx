import React from "react";
import {
  ChooseUsBlob1,
  ChooseUsBlob2,
  ChooseUsBlob3,
} from "../../svg/ChooseUsBlobs";

const ChooseUs = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-16 h-[80vh]">
      <div>
        <h1 className="text-[3.5rem] font-bold text-white font-outfit">
          Why Choose Us...?
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-32 place-items-center ">
        <div className="relative flex items-center justify-center w-full h-[80%] ">
          <ChooseUsBlob1 className="h-[48vh] transform rotate-[76deg]" />
          <div className="absolute gap-5 top-[15%] left-[30%]">
            <h1 className="w-full mb-5 text-3xl font-semibold font-outfit text-[#0075BC]">
              Efficiency
            </h1>
            <p className="w-[70%] text-xl font-normal font-outfit">
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-full h-[80%] ">
          <ChooseUsBlob2 className="h-[48vh]" />
          <div className="absolute left-[30%] top-[15%] gap-5">
            <h1 className="mb-5 text-3xl font-semibold font-outfit text-[#0075BC]">
              Convenience
            </h1>
            <p className="text-xl font-normal w-[80%] font-outfit">
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-full h-[80%] ">
          <ChooseUsBlob3 className="h-[48vh]" />
          <div className="absolute left-[22%] top-[15%] gap-5">
            <h1 className="mb-5 text-3xl font-semibold font-outfit text-[#0075BC]">
              Personalization
            </h1>
            <p className="text-xl font-normal w-[80%] font-outfit">
              Tailored recommendations and reminders to help you stay on top of
              your health..
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseUs;
