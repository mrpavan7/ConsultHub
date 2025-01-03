import React, { useEffect, useRef } from "react";
import classes from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setLoading } from "../../features/Ui/ui.slice.js";
import { auth } from "../../firebase/firebase.js";
import { logout } from "../../features/Auth/auth.slice.js";
import { showToast } from "../../config/toastConfig.js";

const DropDown = (...props) => {
  const dropDownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropDownRef.current &&
        props[0].profileRef.current &&
        !dropDownRef.current.contains(event.target) &&
        !props[0].profileRef.current.contains(event.target)
      ) {
        props[0].setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSignOut = async () => {
    dispatch(setLoading(true));
    try {
      await signOut(auth);
      console.log("Successfully Signed Out");
      navigate("/");
      dispatch(logout());
      setTimeout(() => {
        showToast.success("Signed-out Successfully.");
      }, 100);
    } catch (error) {
      setTimeout(() => {
        showToast.error("Error while Signing Out.");
      }, 100);
      console.error("Error while Signing Out", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      ref={dropDownRef}
      className={`${classes.dropDown} ${
        props[0].isVisible && classes.dropDownActive
      } bg-white flex flex-col items-start gap-3 font-semibold text-base p-5 absolute`}
    >
      <button
        className={`${classes.dropDownBtn} hover:border-b-2 hover:border-[#004a76]`}
        onClick={() => {
          navigate("/my-profile");
          props[0].setIsVisible(false);
        }}
      >
        My Profile
      </button>
      <button
        className={`${classes.dropDownBtn} hover:border-b-2 hover:border-[#004a76]`}
        onClick={() => {
          navigate("/my-appointments");
          props[0].setIsVisible(false);
        }}
      >
        My Appointments
      </button>
      <button
        className={`${classes.dropDownBtn} hover:border-b-2 hover:border-[#004a76]`}
        onClick={handleSignOut}
      >
        sign-Out
      </button>
    </div>
  );
};

export default DropDown;
