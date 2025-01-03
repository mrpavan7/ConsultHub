import React, { useEffect, useState } from "react";
import { MyProfileBlobLeft } from "../../svg/MyProfileBlobLeft.svg";
import { MyProfileBlobRight } from "../../svg/MyProfileBlobRight.svg";
import { MyProfileBlobCenter } from "../../svg/MyProfileBlobCenter.svg";
import { format } from "date-fns";
import { MdModeEditOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/Ui/ui.slice";
import axios from "axios";
import { updateUser } from "../../features/Auth/auth.slice";
import { showToast } from "../../config/toastConfig";

const MyProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [preview, setPreview] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    photo: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    DOB: null,
  });

  useEffect(() => {
    const { name, email, phone, photo, address, gender, DOB } = user;
    setUserData({ name, email, phone, photo, address, gender, DOB });
  }, [user]);

  const resizeImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 100.14;
        canvas.height = 100.14;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedImage = canvas.toDataURL("image/png");
        callback(resizedImage);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setUserData({ ...userData, [name]: value });
      }
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && value.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
    }
  };

  const handleDateChange = (event) => {
    const name = event.target.name;
    const inputDate = new Date(event.target.value);
    const formattedDate = format(inputDate, "dd MMMM, yyyy");
    setUserData({ ...userData, [name]: formattedDate });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, (resizedImage) => {
        setUserData({ ...userData, photo: resizedImage });
        setPreview(resizedImage);
      });
    }
  };

  const handleImageClick = () => {
    document.getElementById("photo").click();
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };
  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const cloudinaryUpload = async () => {
    const formDataToUpload = new FormData();
    formDataToUpload.append("file", userData.photo);
    formDataToUpload.append("upload_preset", "profileImage");
    formDataToUpload.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);

    try {
      const uploadResponse = await axios.post(
        import.meta.env.VITE_CLOUDINARY_API,
        formDataToUpload
      );

      const imageUrl = uploadResponse.data.secure_url;
      console.log("Successfully uploaded image");
      return imageUrl;
    } catch (error) {
      console.error("failed to upload image", error.message);
    }
  };

  const updateDatabase = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_API}/users/${user.uid}`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("error while updating to database", error.message);
    }
  };

  const handleSaveClick = async () => {
    if (userData.phone && userData.phone.length != 10) {
      showToast.warning("Phone number must be exactly 10 digits.");
      return;
    }

    dispatch(setLoading(true));

    try {
      if (userData.photo) {
        const photo = await cloudinaryUpload();
        userData.photo = photo;
      }
      dispatch(updateUser(userData));
      const response = await updateDatabase();
      setTimeout(() => {
        showToast.success("Profile updated successfully!");
      }, 100);
    } catch (error) {
      console.error("error saving data", error.message);
      setTimeout(() => {
        showToast.error("Failed to update profile. Please try again.");
      }, 100);
    } finally {
      dispatch(setLoading(false));
      setIsEditable(false);
    }
  };

  return (
    <>
      <style>
        {`
          .number-input::-webkit-inner-spin-button,
          .number-input::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .number-input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <div className="h-[80vh]  mt-10 overflow-hidden flex justify-center">
        <MyProfileBlobLeft className="h-[77%] absolute -left-[13vw] top-[16vh] transform rotate-[9.98deg]" />
        <div className="absolute right-0 h-full overflow-x-hidden w-fit">
          <MyProfileBlobRight className="h-[73%] transform translate-x-[20vw] translate-y-[4vh] rotate-[0deg]" />
        </div>
        <div className="h-full w-[40%] flex flex-col items-center relative ">
          <div className=" h-fit aspect-square relative flex items-center justify-center rounded-full bg-[#004A76] z-10 border-[3px] border-[#0075BC]">
            {preview || user.photo ? (
              <img
                src={preview ? preview : user.photo}
                alt={"profile Picture"}
                className="h-[100px] rounded-full aspect-square"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[100px]"
                viewBox="0 0 340 340"
              >
                <path
                  fill="#DDD"
                  d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 11-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
                />
              </svg>
            )}
            {isEditable ? (
              <button
                className="absolute bottom-0 right-0 bg-[#004A76] p-[0.3rem] rounded-full text-white text-xl"
                onClick={handleImageClick}
              >
                <MdModeEditOutline />
              </button>
            ) : null}
          </div>
          <MyProfileBlobCenter className="absolute top-12" />
          <div className="z-10 flex flex-col items-start h-full relative  w-[75%] ml-24 mt-3 font-outfit">
            <input
              type="file"
              name="photo"
              id="photo"
              onChange={handleImageChange}
              className="hidden"
            />
            <h1 className="mb-8 text-5xl font-bold text-white">
              {userData.name}
            </h1>
            <h2 className=" text-xl font-semibold text-[#0075BC] mb-5">
              CONTACT INFORMATION
            </h2>
            <div className="flex gap-2">
              <div className="flex">
                <p className="text-xl font-normal text-white min-w-24 ">
                  Email Id
                </p>
                <p className="text-xl font-normal text-white ">:</p>
              </div>
              <p className="text-[#004A76] text-xl">
                {isEditable ? (
                  <input
                    name="email"
                    id="email"
                    type="text"
                    value={userData.email}
                    onChange={handleChange}
                    className={` focus:outline-none px-2 bg-[#4793c1] rounded-md focus:border focus:border-[#004A76] `}
                  />
                ) : userData.email ? (
                  userData.email
                ) : (
                  "Not Provided"
                )}
              </p>
            </div>
            <div className="flex gap-2 my-2">
              <div className="flex">
                <p className="text-xl font-normal text-white min-w-24">Phone</p>
                <p className="text-xl font-normal text-white">:</p>
              </div>
              <p className="text-[#004A76] text-xl ">
                {isEditable ? (
                  <input
                    name="phone"
                    type="number"
                    value={userData.phone}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className={`number-input focus:outline-none px-2 bg-[#4793c1] rounded-md focus:border focus:border-[#004A76]`}
                  />
                ) : userData.phone ? (
                  userData.phone
                ) : (
                  "Not Provided"
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex">
                <p className="text-xl font-normal text-white min-w-24">
                  Address
                </p>
                <p className="text-xl font-normal text-white">:</p>
              </div>
              <p className="text-lg text-white w-[17vw]">
                {isEditable ? (
                  <textarea
                    name="address"
                    id="address"
                    type="text"
                    value={userData.address}
                    onChange={handleChange}
                    className={` focus:outline-none px-2 w-[17vw] max-h-[11vh] resize-none bg-[#4793c1] rounded-md focus:border focus:border-[#004A76] `}
                  ></textarea>
                ) : userData.address ? (
                  userData.address
                ) : (
                  "Not Provided"
                )}
              </p>
            </div>
            <h2 className="text-xl font-semibold text-[#0075BC] mt-2 ">
              BASIC INFORMATION
            </h2>
            <div className="flex gap-2 my-2">
              <div className="flex">
                <p className="text-xl font-normal text-white min-w-24">
                  Gender
                </p>
                <p className="text-xl font-normal text-white">:</p>
              </div>
              <p className="text-xl text-white ">
                {isEditable ? (
                  <select
                    name="gender"
                    id="gender"
                    value={userData.gender}
                    onChange={handleChange}
                    className={` focus:outline-none px-2 max-h-[11vh] resize-none bg-[#4793c1] rounded-md focus:border focus:border-[#004A76]`}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : userData.gender ? (
                  userData.gender
                ) : (
                  "Not Provided"
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex">
                <p className="text-xl font-normal text-white min-w-24">
                  Birthday
                </p>
                <p className="text-xl font-normal text-white">:</p>
              </div>
              <p className="text-xl text-white ">
                {isEditable ? (
                  <input
                    type="date"
                    name="DOB"
                    id="DOB"
                    onChange={handleDateChange}
                    className={` focus:outline-none px-2 max-h-[11vh] resize-none bg-[#4793c1] rounded-md focus:border focus:border-[#004A76]`}
                  />
                ) : userData.DOB ? (
                  userData.DOB
                ) : (
                  "Not Provided"
                )}
              </p>
            </div>
            <div className="flex w-[70%] mt-4 justify-start gap-10">
              {!isEditable ? (
                <button
                  className="bg-[#0075BC] text-xl font-bold text-white w-[100px] px-5 py-[5px] rounded-full"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    className="bg-[#0075BC] text-xl font-bold text-white w-[100px] px-5 py-[5px] rounded-full"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#0075BC] text-xl font-bold text-white w-[100px] px-5 py-[5px] rounded-full"
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
