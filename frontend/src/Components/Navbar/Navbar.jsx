import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import { IoSearch } from "react-icons/io5";
import { ReactComponent as NavBlob } from "../../svg/NavBlob.svg.jsx";
import DropDown from "./DropDown.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/Ui/ui.slice.js";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
import { logout } from "../../features/Auth/auth.slice.js";
import defaultDoctorImage from "../../assets/defaultDoctorImage.png";
import { addSelectedDoctor } from "../../features/doctors/doctors.slice.js";
import { showToast } from "../../config/toastConfig.js";

const Navbar = ({ location }) => {
  const [activeLink, setActiveLink] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userLinks = [
    { name: "Home", path: "./" },
    { name: "All doctors", path: "./doctors" },
    { name: "About", path: "./about" },
    { name: "Contact", path: "./contact" },
    { name: "FAQ", path: "./faq" },
  ];

  const doctorLinks = [
    { name: "Dashboard", path: "./dashboard" },
    { name: "Appointments", path: "./all-appointments" },
    { name: "All Patients", path: "./all-patients" },
    { name: "About", path: "./about" },
    { name: "Contact", path: "./contact" },
    { name: "My Profile", path: "./doctor-profile" },
  ];

  const links = user?.role === "Doctor" ? doctorLinks : userLinks;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const doctors = useSelector((state) => state.doctors.doctors);
  const updatedLocation = "." + location;

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        showToast.error("Error while Signing Out");
      }, 100);
      console.error("Error while Signing Out", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery)
  );

  const handleDoctorSelect = (doctor) => {
    dispatch(addSelectedDoctor(doctor));
    setSearchQuery("");
    setShowSearchResults(false);
    navigate("/doctors/doctor-profile");
  };

  useEffect(() => {
    const index = links.findIndex((link) => {
      return link.path === updatedLocation;
    });
    setActiveLink(index !== -1 ? index : 0);
  }, [location]);

  return (
    <header
      className={`${
        classes.banner
      } z-10 flex flex-row gap-0 items-center relative pt-8 pb-10 ${
        user?.role === "Doctor" ? " justify-evenly px-5" : " px-5 gap-10"
      }`}
    >
      <div
        className={`h-[22vh] w-[65vw] -z-10 absolute top-0 -right-10 overflow-hidden`}
      >
        <NavBlob
          className={`w-full transform translate-y-[-86%] ${
            user?.role === "Doctor" ? "translate-x-[8%]" : "translate-x-[15%]"
          }`}
        />
      </div>
      <div
        className={`${classes.logo} cursor-default flex items-center flex-row gap-12`}
      >
        <h1 className="text-4xl font-bold text-white">ConsultHub</h1>
        <div className={`${classes.line} h-10`}></div>
      </div>
      <div
        className={`${classes.firstHalf} flex flex-row justify-between w-2/3 items-center text-white font-bold h-10 `}
      >
        <div
          className={`${classes.links} flex flex-row gap-10 text-white font-bold items-center text-xl`}
        >
          {links.map((link, index) => {
            if (index === activeLink) {
              return (
                <Link
                  className={`${classes.link} ${classes.active} relative`}
                  to={link.path}
                  key={index}
                >
                  <button>{link.name}</button>
                </Link>
              );
            }
          })}
        </div>
        <div
          className={`${classes.links} flex flex-row gap-10 text-white font-bold items-center text-xl`}
        >
          {links.map((link, index) => {
            if (index !== activeLink) {
              return (
                <Link
                  className={`${classes.link} ${classes.inactive} relative`}
                  to={link.path}
                  key={index}
                >
                  <button
                    onClick={() => {
                      setActiveLink(index);
                      // console.log("active index is ", activeLink);
                    }}
                  >
                    {link.name}
                  </button>
                </Link>
              );
            }
          })}
        </div>
      </div>
      <div
        className={`${classes.secondHalf} flex flex-row h-10 relative items-center gap-4`}
      >
        {user?.role !== "Doctor" ? (
          <div
            className="flex flex-row h-8 bg-white rounded-md min-w-44"
            ref={searchRef}
          >
            <IoSearch className={`${classes.search} ml-1 h-8 w-auto p-1`} />
            <input
              type="text"
              onChange={handleSearch}
              className="p-2 rounded-md w-36 focus:outline-none"
              placeholder="Search Doctors"
            />
            {showSearchResults && (
              <div className="absolute z-50 w-[65%] mt-10 bg-white rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className="flex items-center gap-3 p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-100"
                    >
                      <img
                        src={doctor.photo || defaultDoctorImage}
                        alt={doctor.name}
                        className="object-contain w-10 rounded-full aspect-square"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {doctor.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-3 text-center text-gray-500">
                    No doctors found
                  </p>
                )}
              </div>
            )}
          </div>
        ) : null}

        {isLoggedIn ? (
          <div
            className="w-10 h-10 rounded-full"
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {user.photo ? (
              user?.role === "Doctor" ? (
                <div
                  className={`${classes.signIn} flex w-24 h-9 rounded-full items-center justify-center font-bold text-white`}
                  onClick={handleSignOut}
                >
                  <button>sign-Out</button>
                </div>
              ) : (
                <img
                  src={user.photo}
                  alt=""
                  className={`${classes.profile} h-10 w-10 rounded-full`}
                  ref={profileRef}
                />
              )
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 cursor-pointer"
                viewBox="0 0 340 340"
              >
                <path
                  fill="#0075BC"
                  d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 11-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
                />
              </svg>
            )}
          </div>
        ) : (
          <Link to={"./log-in"}>
            <div
              className={`${classes.signIn} flex w-20 h-8 rounded-full items-center justify-center font-bold text-white`}
            >
              <button>sign-In</button>
            </div>
          </Link>
        )}
        <DropDown
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          profileRef={profileRef}
        />
      </div>
    </header>
  );
};

export default Navbar;
