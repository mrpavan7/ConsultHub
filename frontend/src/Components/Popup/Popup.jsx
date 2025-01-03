import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { openPopup, closePopup } from "../../features/Auth/auth.slice";

const Popup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const visibility = useSelector((state) => state.auth.popupVisibility);

  const handleClick = () => {
    dispatch(closePopup());
    navigate("/my-profile");
  };

  return (
    <AnimatePresence>
      {visibility && (
        <div className="absolute top-0 left-0 z-50 flex w-full h-screen">
          <motion.div
            className="absolute flex flex-col p-5 bg-white bottom-20 right-10 rounded-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <IoClose
              className="self-end text-xl cursor-pointer"
              onClick={() => dispatch(closePopup())}
            />
            <p className="text-lg font-medium">
              Please complete your profile . . .
            </p>
            <button
              className="self-end bg-[#0075bc] text-white mt-3 p-2 rounded-xl font-semibold"
              onClick={handleClick}
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
