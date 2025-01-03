import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogInPic } from "../../svg/LogInPic.svg";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../firebase/firebase";
import { setLoading } from "../../features/Ui/ui.slice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { login, logout } from "../../features/Auth/auth.slice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { showToast } from "../../config/toastConfig";
import "react-toastify/dist/ReactToastify.css";

const LogIn = () => {
  const [activeTab, setActiveTab] = useState("Patient");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Patient",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabChange = (role) => {
    setActiveTab(role);
    setFormData({ ...formData, role });
  };

  const userLogin = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      return user.uid;
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Login error:", error.code);
      switch (error.code) {
        case "auth/invalid-email":
          setTimeout(
            () => showToast.error("Please enter a valid email address"),
            10
          );
          break;
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setTimeout(() => toast.error("Invalid email or password"), 10);
          break;
        case "auth/too-many-requests":
          setTimeout(
            () =>
              showToast.error(
                "Too many failed attempts. Please try again later"
              ),
            10
          );
          break;
        case "auth/network-request-failed":
          setTimeout(
            () =>
              showToast.error("Network error. Please check your connection"),
            10
          );
          break;
        default:
          setTimeout(
            () => showToast.error("An error occurred during login"),
            10
          );
      }
      return null;
    }
  };

  const fetchUser = async (uid) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API}/users/${uid}`
      );
      console.log("User fetched successfully", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error while fetching user", error.message);
      return null;
    }
  };

  const checkRole = async (response) => {
    if (response.role === formData.role) {
      dispatch(login(response));
      setTimeout(() => showToast.success("Signed in successfully!"), 100);
      console.log("User logged in successfully", response);
      navigate(response.role === "Patient" ? "/" : "/dashboard");
      return false;
    } else {
      dispatch(setLoading(false));
      return true;
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));

    try {
      if (formData.password.length < 8) {
        showToast.warning("Password must be at least 8 characters long.");
        return;
      }

      const uid = await userLogin();
      if (!uid) {
        dispatch(setLoading(false));
        return;
      }

      const response = await fetchUser(uid);
      if (!response) {
        showToast.error("Error fetching user data");
        dispatch(setLoading(false));
        return;
      }

      const error = await checkRole(response);
      if (error) {
        await signOut(auth);
        showToast.error("Role mismatch. Please select the correct role.");
        navigate("/");
        dispatch(logout());
      }
    } catch (error) {
      console.error("An error occurred while logging in", error.message);
      showToast.error("An error occurred. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPasswordError(
        value.length < 8 ? "Password must be at least 8 characters long." : ""
      );
    }

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-row h-[80vh] mt-10">
      <ToastContainer />
      <div className="w-[60%] h-full flex items-center justify-center">
        <LogInPic className="h-[80%]" />
      </div>
      <div className=" w-[40%] h-full pl-32 flex flex-col pt-[7%]">
        <h1 className="mb-10 text-5xl font-bold text-white text-outfit">
          Login
        </h1>
        <div className="relative flex flex-row w-[37%] rounded-md h-[5.5%] mb-5 bg-[#529CC7]">
          <div
            className={`h-full w-1/2 absolute bg-[#1078B8] rounded-md transition duration-300 ${
              activeTab === "Doctor" ? "translate-x-full" : "translate-x-0"
            }`}
          ></div>
          <button
            className="z-10 w-1/2 h-full text-xl text-white font-outfit"
            onClick={() => handleTabChange("Patient")}
          >
            Patient
          </button>
          <button
            className="z-10 w-1/2 h-full text-xl text-white font-outfit"
            onClick={() => handleTabChange("Doctor")}
          >
            Doctor
          </button>
        </div>
        <form onSubmit={handleLogin} action="" className="flex flex-col gap-5">
          <input
            required={true}
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="px-5 py-2 rounded-full w-[60%] text-xl font-outfit text-white bg-[#529CC7] placeholder:text-[#A3CBE1] focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
            placeholder="Email"
          />
          <div>
            <div className="relative flex items-center">
              <input
                required={true}
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                className="px-5 py-2 rounded-full w-[60%] text-xl text-white font-outfit bg-[#529CC7] placeholder:text-[#A3CBE1] focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
                placeholder="Password"
              />
              {showPassword ? (
                <IoEye
                  className="absolute left-[52%] text-xl text-[#1078B8] cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <IoEyeOff
                  className="absolute left-[52%] text-xl text-[#1078B8] cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            {passwordError && (
              <p className="text-[#BF0000] text-sm ml-3 mt-1">
                {passwordError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-[30%] mt-5 mb-1 py-[0.35rem] rounded-full bg-[#1078B8] text-white font-bold text-xl font-outfit"
          >
            Login
          </button>
        </form>
        <div className="flex flex-row gap-1">
          <p className="text-lg font-normal text-white font-outfit">
            don't have an account?
          </p>
          <Link to={"/sign-in"}>
            <p
              href=""
              className="text-lg font-normal text-[#1078B8] font-outfit"
            >
              Create Account
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
