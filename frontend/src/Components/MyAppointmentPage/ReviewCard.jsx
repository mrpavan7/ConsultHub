import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({
  feedback,
  handleClose,
  handleChange,
  handleSubmit,
  rating,
  handleRating,
}) => {
  useEffect(() => {
    const scrollableDiv = document.querySelector(".noScrollbar");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);

    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="absolute top-0 right-0 z-50 flex justify-center w-screen h-[170vh] backdrop-blur-lg">
        <div className="flex items-center justify-center w-full h-screen">
          <motion.div
            className="relative flex flex-col items-center w-[30%] min-w-[21rem] h-auto p-5 bg-[#B3E5F6] rounded-lg font-outfit"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", duration: 2, stiffness: 100 }}
          >
            <IoClose
              className="absolute text-2xl cursor-pointer right-5 top-5"
              onClick={handleClose}
            />
            <h1 className="text-2xl my-3 font-bold text-[#004A76]">
              Give Review
            </h1>
            <div className="flex flex-col w-full gap-2">
              <h2 className="text-xl font-semibold text-[#0075BC]">
                Rate your experience :
              </h2>
              <div className="flex gap-2 mb-2 ml-3">
                {Array(5)
                  .fill()
                  .map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <FaStar
                        key={starValue}
                        className={`cursor-pointer text-3xl ${
                          starValue <= rating ? "text-[#0075BC]" : "text-white"
                        }`}
                        onClick={() => handleRating(starValue)}
                      />
                    );
                  })}
              </div>

              <h2 className="text-xl font-semibold text-[#0075BC]">
                Feedback :
              </h2>
              <textarea
                name="feedback"
                id="feedback"
                value={feedback}
                onChange={handleChange}
                className={`noScrollbar bg-[#65AED8] resize-none h-[20vh] rounded-lg focus:outline-none p-2 text-[#004A76] font-medium `}
              ></textarea>
              <div className="flex justify-end gap-5 pt-2 pr-5">
                <button
                  className="text-lg font-semibold text-white bg-[#0075BC] px-2 rounded-md"
                  onClick={handleClose}
                >
                  cancel
                </button>
                <button
                  className="text-lg font-semibold text-white bg-[#0075BC] px-2 rounded-md"
                  onClick={handleSubmit}
                >
                  submit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewCard;
