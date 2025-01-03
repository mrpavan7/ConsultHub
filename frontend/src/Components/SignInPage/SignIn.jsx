import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignInPic } from "../../svg/SignInPic.svg";
import { auth } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login, openPopup } from "../../features/Auth/auth.slice";
import axios from "axios";
import { setLoading } from "../../features/Ui/ui.slice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import { showToast } from "../../config/toastConfig";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("Patient");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    role: "Patient",
    name: "",
    email: "",
    password: "",
  });

  const handleTabChange = (role) => {
    setActiveTab(role);
    setFormData({ ...formData, role });
  };

  const signIn = async (event) => {
    event.preventDefault();
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    dispatch(setLoading(true));

    try {
      if (formData.role === "Doctor") {
        navigate("doctor-form", { state: { ...formData } });
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const uid = userCredential.user.uid;
        await axios.post(`${import.meta.env.VITE_BASE_API}/users`, {
          ...formData,
          uid,
        });
        dispatch(login({ ...formData, uid }));
        navigate("/");
        dispatch(openPopup());
        showToast.success("Successfully Signed-in.");
      }
    } catch (error) {
      console.error(error.message || "An error occurred while signing up.");
      showToast.error("Something went wrong please try again...!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" && value.length < 8) {
      setError("Password must be at least 8 characters long.");
    } else {
      setError("");
    }
  };

  return (
    <div className="flex flex-row h-[80vh] mt-10">
      <div className="w-[40%] h-full pl-20 flex flex-col pt-16">
        <h1 className="text-5xl font-bold text-white mb-14 text-outfit">
          Create Account
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
        <form onSubmit={signIn} className="flex flex-col gap-5">
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            className="px-5 py-2 rounded-full w-[60%] text-xl font-outfit text-white bg-[#529CC7] placeholder:text-[#A3CBE1] focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
            placeholder="Full Name"
          />
          <input
            required
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
                required
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

            {error && (
              <p className="text-[#BF0000] text-sm ml-3 mt-1">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!!error}
            className="w-[33%] mt-5 mb-1 py-[0.35rem] rounded-full bg-[#1078B8] text-white font-bold text-xl font-outfit"
          >
            Create Account
          </button>
        </form>
        <div className="flex flex-row gap-1">
          <p className="text-lg font-normal text-white font-outfit">
            Already have an account?
          </p>
          <Link to={"/log-in"}>
            <p className="text-lg font-normal text-[#1078B8] font-outfit">
              Login here
            </p>
          </Link>
        </div>
      </div>
      <div className="w-[60%] h-full flex items-center justify-center">
        <SignInPic className="h-[90%]" />
      </div>
    </div>
  );
};

export default SignIn;
