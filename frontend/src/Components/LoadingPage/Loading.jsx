import React from "react";
import classes from "./Loading.module.css";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#4793c1]">
      <div className={classes.loader}></div>
    </div>
  );
};

export default Loading;
