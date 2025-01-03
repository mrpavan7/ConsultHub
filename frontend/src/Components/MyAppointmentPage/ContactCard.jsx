import React from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const ContactCard = ({ name, email, phone, address, handleClose }) => {
  return (
    <AnimatePresence>
      <div className="absolute top-0 right-0 z-50 flex justify-center w-screen h-[170vh] backdrop-blur-lg">
        <div className="flex items-center justify-center w-full h-screen">
          <motion.div
            className="relative flex flex-col items-center w-[30%] h-auto p-5 bg-white rounded-lg font-outfit"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", duration: 2, stiffness: 100 }}
          >
            <IoClose
              className="absolute text-2xl cursor-pointer right-5 top-5"
              onClick={handleClose}
            />
            <h1 className="my-3 text-2xl font-bold text-[#0076BC]">
              Contact Details :
            </h1>
            <div className="flex gap-3 h-[25vh] w-full justify-center px-5 font-outfit">
              <div className=" h-full w-[20%] flex flex-col justify-center gap-3 text-xl font-semibold text-[#004A76]">
                <h2>Name</h2>
                <h2>Email</h2>
                <h2>Phone</h2>
                <h2>Address</h2>
              </div>
              <div className="flex flex-col justify-center w-full h-full gap-3 text-lg font-medium ">
                <p>
                  <span className="text-xl text-[#004A76] mr-3">:</span>
                  {name ? name : "Not Provided"}
                </p>
                <p>
                  <span className="text-xl text-[#004A76] mr-3">:</span>
                  {email ? email : "Not Provided"}
                </p>
                <p>
                  <span className="text-xl text-[#004A76] mr-3">:</span>
                  {phone ? phone : "Not Provided"}
                </p>
                <p>
                  <span className="text-xl text-[#004A76] mr-3">:</span>
                  {address ? address : "Not Provided"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ContactCard;
