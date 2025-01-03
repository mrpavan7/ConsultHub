import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./DoctorForm.module.css";
import defaultDoctorImage from "../../assets/defaultDoctorImage.png";
import "./loading.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/Ui/ui.slice.js";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import { auth } from "../../firebase/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { login } from "../../features/Auth/auth.slice.js";
import { toast } from "react-toastify";
import { showToast } from "../../config/toastConfig.js";

const DoctorForm = () => {
  const location = useLocation();
  const { state } = location.state ? location : {};
  const dispatch = useDispatch();
  const [timeSlot, setTimeSlot] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const doctors = useSelector((state) => state.doctors.doctors);
  const currentDoctor = doctors.find((doctor) => doctor.doctorId === user.uid);

  useEffect(() => {
    const scrollableDiv1 = document.querySelector(".scrollable-div1");
    const scrollableDiv2 = document.querySelector(".scrollable-div2");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv1.addEventListener("wheel", stopPropagation);
    scrollableDiv2.addEventListener("wheel", stopPropagation);

    return () => {
      scrollableDiv1.removeEventListener("wheel", stopPropagation);
      scrollableDiv2.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  //setting state to store formdata
  const [formData, setFormData] = useState({
    doctorId: state?.uid || "",
    name: "Dr. " + state?.name || "",
    photo: "",
    email: state?.email || "",
    role: "Doctor",
    speciality: "General Physician",
    phone: "",
    address: "",
    education: "",
    experience: "0",
    appointmentFee: "100",
    about: "",
    dailySlots: [],
  });

  const [updates, setUpdates] = useState({
    doctorId: user?.uid || "",
    name: user?.name || "",
    photo: "",
    email: user?.email || "",
    role: "Doctor",
    speciality: user?.speciality || "General Physician",
    phone: user?.phone || "",
    address: user?.address || "",
    education: user?.education || "",
    experience: user?.experience || "0",
    appointmentFee: user?.appointmentFee || "100",
    about: user?.about || "",
    dailySlots: currentDoctor?.dailySlots || [],
  });

  //state to show image preview
  const [preview, setPreview] = useState(isLoggedIn ? user?.photo : null);

  const signInDoctor = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state?.email,
        state?.password
      );
      const uid = userCredential.user.uid;
      const signInData = { ...formData, uid };
      delete signInData.doctorId;
      dispatch(login(signInData));
      console.log("Successfully signed in doctor", uid);
      return uid;
    } catch (error) {
      console.error("Failed to sign in doctor", error.message);
      return null;
    }
  };

  const addTimeSlot = () => {
    if (isLoggedIn) {
      if (updates.dailySlots.length < 5 && timeSlot) {
        setUpdates({
          ...updates,
          dailySlots: [...updates.dailySlots, timeSlot],
        });
        setTimeSlot("");
      }
    } else {
      if (formData.dailySlots.length < 5 && timeSlot) {
        setFormData({
          ...formData,
          dailySlots: [...formData.dailySlots, timeSlot],
        });
        setTimeSlot("");
      }
    }
  };

  const removeTimeSlot = (index) => {
    if (isLoggedIn) {
      const newdailySlots = updates.dailySlots.filter((_, i) => i !== index);
      setUpdates({
        ...updates,
        dailySlots: newdailySlots,
      });
    } else {
      const newdailySlots = formData.dailySlots.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        dailySlots: newdailySlots,
      });
    }
  };

  //function to store the input values to formData
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "timeSlot") {
      setTimeSlot(value);
      return;
    }

    if (name === "photo" && files && files[0]) {
      if (isLoggedIn) {
        setUpdates({ ...updates, [name]: files[0] });
        setPreview(URL.createObjectURL(files[0]));
        return;
      }
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      if (isLoggedIn) {
        setUpdates({ ...updates, [name]: value });
        return;
      }
      setFormData({ ...formData, [name]: value });
    }
  };

  //to resize image
  const resizeImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 272;
        canvas.height = 332;

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

  //to store image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (isLoggedIn) {
        resizeImage(file, (resizedImage) => {
          setUpdates({ ...updates, photo: resizedImage });
          setPreview(resizedImage);
        });
      } else {
        resizeImage(file, (resizedImage) => {
          setFormData({ ...formData, photo: resizedImage });
          setPreview(resizedImage);
        });
      }
    }
  };

  //to remove the selected image
  const handleRemoveImage = () => {
    setPreview(null);
    isLoggedIn
      ? setUpdates({ ...updates, photo: "" })
      : setFormData({ ...formData, photo: "" });
    const fileInput = document.getElementById("photo");
    fileInput.value = "";
  };

  //to store the doctor data to the Database
  const uploadDoctorToDatabase = async () => {
    try {
      const doctorData = {
        doctorId: formData.doctorId || "",
        name: formData.name,
        photo: formData.photo,
        email: formData.email,
        speciality: formData.speciality,
        phone: formData.phone,
        education: formData.education,
        experience: formData.experience,
        appointmentFee: formData.appointmentFee,
        about: formData.about,
        dailySlots: formData.dailySlots,
        address: formData.address,
      };
      const response = await axios.post(
        import.meta.env.VITE_BASE_API + "/doctors",
        doctorData
      );
      console.log("Successfully uploaded doctor to database", response.data);
    } catch (error) {
      console.error("Failed to upload doctor to database", error.message);
    }
  };

  const uploadUserToDatabase = async () => {
    try {
      const userData = {
        uid: formData.doctorId || "",
        role: "Doctor",
        name: formData.name,
        email: formData.email,
        password: state?.password || "",
        photo: formData.photo,
        phone: formData.phone,
        speciality: formData.speciality,
        education: formData.education,
        experience: formData.experience,
        appointmentFee: formData.appointmentFee,
        about: formData.about,
        address: formData.address,
      };

      const response = await axios.post(
        import.meta.env.VITE_BASE_API + "/users",
        userData
      );
      console.log("Successfully uploaded user to database", response.data);
    } catch (error) {
      console.error("Failed to upload user to database", error.message);
    }
  };

  const uploadUpdatedUserToDatabase = async () => {
    try {
      const userData = {
        photo: updates.photo,
        phone: updates.phone,
        speciality: updates.speciality,
        education: updates.education,
        experience: updates.experience,
        appointmentFee: updates.appointmentFee,
        about: updates.about,
        address: updates.address,
      };

      const uid = user?.uid;

      const response = await axios.put(
        import.meta.env.VITE_BASE_API + "/users/" + uid,
        userData
      );
      console.log("Successfully uploaded user to database", response.data);
    } catch (error) {
      console.error("Failed to upload user to database", error.message);
    }
  };

  const uploadUpdatedDoctorToDatabase = async () => {
    try {
      const doctorData = {
        photo: updates.photo,
        email: updates.email,
        speciality: updates.speciality,
        phone: updates.phone,
        education: updates.education,
        experience: updates.experience,
        appointmentFee: updates.appointmentFee,
        about: updates.about,
        dailySlots: updates.dailySlots,
        address: updates.address,
      };

      const id = user.uid;

      const response = await axios.put(
        import.meta.env.VITE_BASE_API + "/doctors/" + id,
        doctorData
      );
      console.log("Successfully uploaded doctor to database", response.data);
    } catch (error) {
      console.error("Failed to upload doctor to database", error.message);
    }
  };

  //function to upload image to cloudinary
  const cloudinaryUpload = async () => {
    const formDataToUpload = new FormData();
    formDataToUpload.append(
      "file",
      isLoggedIn ? updates.photo : formData.photo
    );
    formDataToUpload.append("upload_preset", "doctorImage");
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

  //upload all details to database and cloudinary and redux
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data:", formData);
    if (formData.dailySlots.length === 0) {
      showToast.warning("Please select the Appointment time slots.");
      return;
    }
    dispatch(setLoading(true));
    try {
      if (formData.photo) {
        const imageUrl = await cloudinaryUpload();
        formData.photo = imageUrl;
      }
      const uid = await signInDoctor();
      formData.doctorId = uid;
      await uploadDoctorToDatabase();
      await uploadUserToDatabase();
      navigate("/dashboard");
      showToast.success("Successfully signed-in.");
    } catch (error) {
      console.error("Failed to create doctor", error.message);
      showToast.error("Something went wrong please try again...!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log("updates", updates);
    dispatch(setLoading(true));
    try {
      if (updates.photo) {
        const imageUrl = await cloudinaryUpload();
        updates.photo = imageUrl;
      }
      const uid = user?.uid;
      await uploadUpdatedDoctorToDatabase();
      await uploadUpdatedUserToDatabase();
      navigate("/doctor-profile");
    } catch (error) {
      console.error("Failed to edit doctor profile", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center w-full mt-10 h-fit">
      <div className="w-[70%] bg-[#65AED8] rounded-t-2xl mt-10 flex flex-col items-center">
        <h1 className="flex justify-center w-full text-3xl font-medium font-outfit text-[#004A76] my-5">
          {isLoggedIn
            ? "Editing your profile..."
            : "Let's complete your profile...!"}
        </h1>
        <div className="flex justify-center w-full">
          <div className="bg-[#529CC7] rounded-2xl">
            <img
              src={preview ? preview : defaultDoctorImage}
              alt="Preview"
              className="object-cover w-32 h-32 rounded-full"
              style={{
                width: "272px",
                height: "332px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
        <div className="w-fit">
          <form
            action="#"
            className="flex flex-col items-start"
            onSubmit={isLoggedIn ? handleEdit : handleSubmit}
          >
            <div
              className={`${classes.customFileInput} w-full flex justify-center`}
            >
              <input
                type="file"
                id="photo"
                name="photo"
                className="hidden"
                onChange={handleImageChange}
              />
              {!preview ? (
                <>
                  <label
                    htmlFor="photo"
                    className={`${classes.uploadLabel} bg-[#1078B8] my-5 hover:border`}
                  >
                    Choose Profile Picture
                  </label>
                </>
              ) : (
                <div className="flex justify-center w-full my-5">
                  <button
                    type="button"
                    className="px-4 py-1 bg-[#0075BC] text-white rounded-md font-outfit mr-2"
                    onClick={() => document.getElementById("photo").click()}
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1 text-white bg-red-500 rounded-md font-outfit"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col w-full gap-1">
              <label
                htmlFor="name"
                className="text-base font-medium font-outfit text-[#004A76]"
              >
                Name :
              </label>
              <input
                type="text"
                id="name"
                name="name"
                disabled={
                  isLoggedIn
                    ? updates?.name
                      ? true
                      : false
                    : formData?.name
                    ? true
                    : false
                }
                value={isLoggedIn ? updates.name : formData.name}
                onChange={handleChange}
                className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-1 mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <label
                htmlFor="email"
                className="text-base font-medium font-outfit text-[#004A76]"
              >
                Email :
              </label>
              <input
                type="email"
                id="email"
                name="email"
                disabled
                value={isLoggedIn ? updates.email : formData.email}
                onChange={handleChange}
                className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-1 mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
              />
            </div>
            <div className="flex flex-col w-full gap-1">
              <label
                htmlFor="phone"
                className="text-base font-medium font-outfit text-[#004A76]"
              >
                Phone :
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={isLoggedIn ? updates.phone : formData.phone}
                onChange={(e) => {
                  if (/^\d{0,10}$/.test(e.target.value)) {
                    setFormData({ ...formData, phone: e.target.value });
                    e.target.setCustomValidity(""); // Clear any existing error message
                  }
                }}
                onInvalid={(e) => {
                  e.target.setCustomValidity(
                    "Please enter a valid 10-digit phone number."
                  );
                }}
                onInput={(e) => e.target.setCustomValidity("")} // Clear error on input
                pattern="\d{10}"
                maxLength="10"
                required
                className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-1 mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC] no-arrows"
              />
            </div>

            <div className="flex flex-col w-full mb-5 h-[30vh]">
              <label
                htmlFor="about"
                className="text-base font-medium font-outfit text-[#004A76]"
              >
                Address :{" "}
              </label>
              <textarea
                className={`${classes.noScrollbar} scrollable-div1 px-2 text-lg bg-[#529CC7] w-full min-w-[50vh] h-full resize-none rounded-md font-outfit focus:outline-none focus:ring-2 focus:ring-[#0075BC]`}
                required
                name="address"
                id="address"
                value={isLoggedIn ? updates.address : formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <label
              htmlFor="speciality"
              className="text-base font-medium font-outfit text-[#004A76]"
            >
              speciality :
            </label>
            <select
              className="px-2 py-1 text-lg focus:outline-none focus:ring-2 focus:ring-[#0075BC] bg-[#529CC7] w-[100%] rounded-md font-outfit mb-5"
              name="speciality"
              id="speciality"
              value={isLoggedIn ? updates.speciality : formData.speciality}
              onChange={handleChange}
            >
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist </option>
              <option value="Pediatricians">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
            <label
              htmlFor="education"
              className="text-base font-medium font-outfit text-[#004A76]"
            >
              Education :{" "}
            </label>
            <input
              className="px-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#0075BC] bg-[#529CC7] w-[100%] py-1 rounded-md font-outfit mb-5"
              required
              type="text"
              id="education"
              name="education"
              value={isLoggedIn ? updates.education : formData.education}
              onChange={handleChange}
            />
            <label
              htmlFor="experience"
              className="text-base font-medium font-outfit text-[#004A76]"
            >
              Experience (in years) :{" "}
            </label>
            <input
              className={`${classes.noArrows} px-2 text-lg bg-[#529CC7] w-[100%] py-1 rounded-md font-outfit mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC]`}
              type="number"
              id="experience"
              name="experience"
              value={isLoggedIn ? updates.experience : formData.experience}
              onChange={handleChange}
            />
            <label
              htmlFor="appointmentFee"
              className="text-base font-medium font-outfit text-[#004A76]"
            >
              AppointmentFee (in Rupees) :{" "}
            </label>
            <input
              className={`${classes.noArrows} px-2 text-lg bg-[#529CC7] w-[100%] py-1 rounded-md font-outfit mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC]`}
              type="number"
              id="appointmentFee"
              name="appointmentFee"
              value={
                isLoggedIn ? updates.appointmentFee : formData.appointmentFee
              }
              onChange={handleChange}
            />

            <label
              htmlFor="timeSlot"
              className="text-base font-medium font-outfit text-[#004A76]"
            >
              Appointment Time Slot (Max 5) :{" "}
            </label>
            <div className="flex items-center mb-5">
              <input
                className="px-2 text-lg bg-[#529CC7] w-[70%] py-1 rounded-md font-outfit focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
                type="time"
                id="timeSlot"
                name="timeSlot"
                value={timeSlot}
                onChange={handleChange}
              />
              <button
                type="button"
                className="ml-2 px-4 py-1 bg-[#0075BC] text-white rounded-md font-outfit"
                onClick={addTimeSlot}
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap">
              {isLoggedIn
                ? updates.dailySlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-[#529CC7] text-white px-3 py-1 rounded-md mr-2 mb-2"
                    >
                      <span className="mr-2">{slot}</span>
                      <button
                        type="button"
                        className="text-[#004A76] text-xl font-bold flex items-center justify-center"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <IoCloseSharp />
                      </button>
                    </div>
                  ))
                : formData.dailySlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-[#529CC7] text-white px-3 py-1 rounded-md mr-2 mb-2"
                    >
                      <span className="mr-2">{slot}</span>
                      <button
                        type="button"
                        className="text-[#004A76] text-xl font-bold flex items-center justify-center"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <IoCloseSharp />
                      </button>
                    </div>
                  ))}
            </div>

            <div className="flex flex-col w-full h-[30vh]">
              <label
                htmlFor="about"
                className="text-base font-medium font-outfit text-[#004A76]"
              >
                About :{" "}
              </label>
              <textarea
                className={`${classes.noScrollbar} scrollable-div2 px-2 text-lg bg-[#529CC7] w-full min-w-[50vh] h-full resize-none rounded-md font-outfit focus:outline-none focus:ring-2 focus:ring-[#0075BC]`}
                required
                name="about"
                id="about"
                value={isLoggedIn ? updates.about : formData.about}
                onChange={handleChange}
              ></textarea>
            </div>
            {isLoggedIn ? (
              <div className="flex justify-center w-full gap-10">
                <button
                  type="submit"
                  className={`p-2 mt-4 mb-5 font-semibold text-white bg-[#1078B8] rounded-md hover:border`}
                >
                  <p>Edit Profile</p>
                </button>
                <button
                  type="cancel"
                  className={`p-2 mt-4 mb-5 font-semibold text-white bg-[#1078B8] rounded-md hover:border`}
                >
                  <p>Cancel</p>
                </button>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <button
                  type="submit"
                  className={`p-2 mt-4 mb-5 font-semibold text-white bg-[#1078B8] rounded-md hover:border`}
                >
                  <p>Complete Profile</p>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;
