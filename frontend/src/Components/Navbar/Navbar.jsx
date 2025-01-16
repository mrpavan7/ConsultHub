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
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const Navbar = ({ location }) => {
  const [activeLink, setActiveLink] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userLinks = [
    { name: "Home", path: "./" },
    { name: "Doctors", path: "./doctors" },
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
    { name: "Sign-out" },
  ];

  const links = user?.role === "Doctor" ? doctorLinks : userLinks;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const doctors = useSelector((state) => state.doctors.doctors);
  const updatedLocation = "." + location;

  const searchRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

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
        user?.role === "Doctor" ? " justify-evenly px-5" : " px-5 gap-[2vw]"
      }`}
    >
      <div
        className={`h-[25vh] 2xl:w-[65vw] xl:w-[65vw] lg:w-[75vw] md:w-[80vw] hidden md:block absolute top-0 -right-10 overflow-hidden`}
      >
        <NavBlob
          className={`w-full transform xl:translate-y-[-86%] lg:translate-y-[-84%] md:translate-y-[-82%]  ${
            user?.role === "Doctor" ? "translate-x-[8%]" : "translate-x-[15%]"
          }`}
        />
      </div>
      <div
        className={`${classes.logo} cursor-default flex items-center flex-row gap-[2vw]`}
      >
        <h1 className="text-lg font-bold text-white md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl ">
          ConsultHub
        </h1>
        <div className={`${classes.line} h-10 hidden md:block`}></div>
      </div>

      {/* Mobile Search, Profile and Menu */}
      <div className="flex items-center gap-4 ml-auto md:hidden">
        {user?.role !== "Doctor" && (
          <div className="relative" ref={searchRef}>
            <div className="flex flex-row items-center bg-white rounded-md">
              <IoSearch className="p-1 ml-1 text-2xl text-[#0075BC]" />
              <input
                type="text"
                onChange={handleSearch}
                className="p-1 w-[120px] rounded-md focus:outline-none text-sm"
                placeholder="Search"
              />
            </div>
            {showSearchResults && (
              <div className="absolute z-50 w-[200px] right-0 mt-2 bg-white rounded-lg shadow-lg max-h-[400px] overflow-y-auto">
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
                        className="object-contain w-10 border-2 border-[#0075BC] rounded-full aspect-square"
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
        )}

        {/* Mobile Profile/Sign In */}
        {isLoggedIn ? (
          <div className="relative">
            <div className="w-8 h-8" onClick={() => setIsVisible(!isVisible)}>
              {user.photo ? (
                user?.role === "Doctor" ? (
                  <button
                    className="px-3 py-1 text-sm text-white rounded-full bg-[#0075BC]"
                    onClick={handleSignOut}
                  >
                    Sign-Out
                  </button>
                ) : (
                  <img
                    src={user.photo}
                    alt=""
                    className="w-8 h-8 rounded-full"
                    ref={profileRef}
                  />
                )
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 cursor-pointer"
                  viewBox="0 0 340 340"
                >
                  <path
                    fill="#0075BC"
                    d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 11-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
                  />
                </svg>
              )}
            </div>
            <DropDown
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              profileRef={profileRef}
            />
          </div>
        ) : (
          <Link to={"./log-in"}>
            <button className="px-3 py-1 text-sm text-white rounded-full bg-[#0075BC]">
              Sign-In
            </button>
          </Link>
        )}

        {/* Hamburger Menu Button */}
        <button
          className="text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <IoClose className="w-8 h-8" />
          ) : (
            <HiMenuAlt3 className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-[80%] bg-[#0075BC] transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-50`}
      >
        <div className="flex flex-col p-8 pt-20">
          <button
            className="absolute text-white top-8 right-8"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoClose className="w-8 h-8" />
          </button>
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`text-white text-xl py-4 border-b border-white/20 ${
                index === activeLink ? "font-bold" : ""
              }`}
              onClick={() => {
                if (link.name === "Sign-out") {
                  handleSignOut();
                  return;
                }
                setActiveLink(index);
                setIsMobileMenuOpen(false);
              }}
            >
              {link.name}
            </Link>
          ))}
          {!isLoggedIn && (
            <Link
              to="./log-in"
              className="mt-8 text-xl text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div
        className={`${classes.firstHalf} hidden md:flex flex-row justify-between w-2/3 items-center text-white font-bold h-10 `}
      >
        <div
          className={`${
            classes.links
          } mr-[2rem] flex flex-row text-white font-bold items-center
         ${
           user.role === "Doctor"
             ? ` sm:text-sm
           md:text-sm
           lg:text-base
           xl:text-lg
           2xl:text-xl`
             : ` sm:text-sm
           md:text-base
           lg:text-lg
           xl:text-xl
           2xl:text-2xl`
         }`}
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
          className={`${classes.links}
           justify-end flex flex-row text-white font-bold items-center
           sm:gap-2 
           md:gap-5 
           lg:gap-7 
           xl:gap-8
           2xl:gap-10
           transition-all duration-200
           ${
             user.role === "Doctor"
               ? `sm:text-sm
           md:text-sm
           lg:text-base
           xl:text-lg
           2xl:text-xl`
               : `sm:text-sm
           md:text-base
           lg:text-lg
           xl:text-xl
           2xl:text-2xl`
           }`}
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
        className={`${classes.secondHalf} hidden md:flex flex-row h-10 relative items-center gap-[1vw]`}
      >
        {user?.role !== "Doctor" ? (
          <div
            className="flex flex-row items-center bg-white rounded-md"
            ref={searchRef}
          >
            <IoSearch className={`${classes.search} ml-1 text-3xl p-1`} />
            <input
              type="text"
              onChange={handleSearch}
              className="p-[min(0.3vw,0.5rem)] w-[9vw] rounded-md focus:outline-none"
              placeholder="Search"
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
