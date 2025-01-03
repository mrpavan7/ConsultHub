import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const links = [
    { name: "Home", path: "./" },
    { name: "About", path: "./about" },
    { name: "Contact Us", path: "./contact" },
    { name: "Privacy Policy", path: "./privacy policy" },
  ];
  return (
    <div>
      <footer className="h-[50vh] flex flex-col items-center">
        <div className=" flex flex-col items-center bg-[#B3E5F6] h-[80%] w-[98.9vw] z-30">
          <div className="grid grid-cols-4 h-full w-[90%] gap-12">
            <div className="flex flex-col justify-center col-span-2 gap-8 ">
              <h1 className="text-3xl font-bold text-[#0075BC] font-inter">
                ConsultHub
              </h1>
              <p className="text-xl font-outfit text-[#4B5563]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="flex flex-col justify-center pl-24 ">
              <h1 className="text-2xl font-semibold font-outfit text-[#0075BC]">
                Company
              </h1>
              <div className="">
                {links.map((link, index) => {
                  return (
                    <Link to={link.path} key={index}>
                      <p className="text-xl font-normal text-[#4B5563] pt-2">
                        {link.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col pt-16 pl-10 ">
              <h1 className="text-2xl font-semibold font-outfit text-[#0075BC]">
                Get In Touch
              </h1>
              <div className="">
                <p className="text-xl font-normal text-[#4B5563] pt-2">
                  +1-212-456-7890
                </p>
                <p className="text-xl font-normal text-[#4B5563] pt-2">
                  greatstackdev@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[95%] h-[1px] bg-[#BDBDBD] mt-4"></div>
        <p className="w-full text-lg font-light text-center font-outfit text-[#4B5563] mt-3">
          Copyright © 2024 GreatStack - All Right Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
