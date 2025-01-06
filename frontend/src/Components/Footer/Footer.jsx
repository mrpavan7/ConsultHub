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
      <footer className="min-h-[50vh] flex flex-col items-center">
        <div className="flex flex-col items-center bg-[#B3E5F6] w-full py-8 px-4">
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl md:gap-12">
            <div className="flex flex-col justify-center col-span-1 gap-4 md:col-span-2 md:gap-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0075BC] font-inter">
                ConsultHub
              </h1>
              <p className="text-base md:text-xl font-outfit text-[#4B5563]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="flex flex-col justify-center pl-4 md:pl-24">
              <h1 className="text-xl md:text-2xl font-semibold font-outfit text-[#0075BC] mb-4">
                Company
              </h1>
              <div className="flex flex-col gap-2">
                {links.map((link, index) => {
                  return (
                    <Link to={link.path} key={index}>
                      <p className="text-base md:text-xl font-normal text-[#4B5563]">
                        {link.name}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col pl-4 md:pl-10">
              <h1 className="text-xl md:text-2xl font-semibold font-outfit text-[#0075BC] mb-4">
                Get In Touch
              </h1>
              <div className="flex flex-col gap-2">
                <p className="text-base md:text-xl font-normal text-[#4B5563]">
                  +1-212-456-7890
                </p>
                <p className="text-base md:text-xl font-normal text-[#4B5563]">
                  greatstackdev@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[95%] h-[1px] bg-[#BDBDBD] my-4"></div>
        <p className="w-full text-sm md:text-lg font-light text-center font-outfit text-[#4B5563] mb-3">
          Copyright © 2024 GreatStack - All Right Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
