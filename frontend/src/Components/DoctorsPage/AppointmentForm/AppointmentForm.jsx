import React, { useEffect, useState } from "react";
import classes from "./AppointmentForm.module.css";
import { BookAppointmentPic } from "../../../svg/bookAppointmentPic.svg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoading } from "../../../features/Ui/ui.slice.js";
import axios from "axios";
import { showToast } from "../../../config/toastConfig.js";
import { fetchAppointments } from "../../../features/appointments/appointment.slice.js";

const AppointmentForm = () => {
  const selectedDoctor =
    useSelector((state) => state.doctors.selectedDoctor) || {};
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = React.useState({
    doctorName: selectedDoctor?.name,
    patientName: user?.name,
    doctorId: selectedDoctor?.doctorId,
    patientId: user?.uid,
    appointmentDate: "",
    appointmentTime: "",
    appointmentFee: selectedDoctor?.appointmentFee || 0,
    problem: "",
    notes: "",
    paymentStatus: "Pending",
    speciality: selectedDoctor?.speciality,
  });

  const [selected, setSelected] = useState(false);
  const [loader, setLoader] = useState(false);
  const [agree, setAgree] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const scrollableDiv = document.querySelector(".scrollable-div");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);
    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "availableSlots") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        appointmentTime: value,
      }));
      return;
    }

    if (name === "termsAndConditions") {
      if (e.target.checked) {
        setAgree(true);
      } else {
        setAgree(false);
      }
      return;
    }

    if (name === "appointmentDate") {
      setAvailableSlots([]);
      setFormData({ ...formData, [name]: value });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const fetchAvailableSlots = async (data) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/appointments/available-slots",
        { params: data }
      );

      let slots = response.data.slots;

      if (data.appointmentDate === new Date().toISOString().split("T")[0]) {
        const currentTime =
          new Date().getHours() + ":" + new Date().getMinutes();
        slots = slots.filter((slot) => slot > currentTime);
      }

      console.log("Successfully fetched available slots:", slots);
      return slots;
    } catch (error) {
      console.error("Error in fetching available slots:", error.message);
      showToast.error("Error while fetching available slots.");
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      return null;
    }
  };

  const showAvailableSlots = async (e) => {
    e.preventDefault();
    setLoader(true);
    const data = {
      doctorId: formData.doctorId,
      appointmentDate: formData.appointmentDate,
    };
    if (!data.doctorId || !data.appointmentDate) {
      showToast.warning("Please select a Date to check available slots.");
      setLoader(false);
      return;
    }
    const slots = await fetchAvailableSlots(data);
    if (slots) {
      setAvailableSlots(slots);
      setFormData((prevFormData) => ({
        ...prevFormData,
        appointmentTime: slots[0],
      }));
    }
    if (slots.length === 0) {
      showToast.info(
        "No available slots for the selected date. Please select another date."
      );
    }
    setLoader(false);
  };

  const handlePayLater = (e) => {
    e.preventDefault();
    setSelected(!selected);
    if (!selected) {
      showToast.info(
        "Please remember to pay the fee at the time of appointment."
      );
      setFormData({ ...formData, paymentStatus: "Pending" });
    } else {
      setFormData({ ...formData, paymentStatus: "" });
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    showToast.info(
      "The 'Pay Now' feature is currently under development. Please select the 'Pay Later' option to proceed with your appointment booking."
    );
  };

  const handleFetchAppointments = async () => {
    try {
      if (user && user.role !== "Guest") {
        const { role, uid } = user;
        dispatch(fetchAppointments({ role, uid }));
      }
    } catch (error) {
      console.error("failed to fetch appointments", error.message);
    }
  };

  const createAppointment = async (data) => {
    try {
      console.log("data before calling API:", data);
      const response = await axios.post(
        import.meta.env.VITE_BASE_API + "/appointments",
        data
      );

      console.log("Successfully created appointment: ", response);
      return response;
    } catch (error) {
      console.error("Failed to create an appointment", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert(
          `Error: ${
            error.response.data.message || "Failed to create appointment"
          }`
        );
      }
      return null;
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!formData.appointmentDate)
      validationErrors.push("Please select an appointment date.");
    if (!formData.appointmentTime)
      validationErrors.push("Please select an available slot.");
    if (!formData.paymentStatus)
      validationErrors.push("Please select the Payment method.");
    if (!agree)
      validationErrors.push(
        "Please agree to the terms and conditions to proceed."
      );

    if (validationErrors.length > 0) {
      showToast.warning(validationErrors[0]);
      return;
    }
    try {
      dispatch(setLoading(true));

      const response = await createAppointment(formData);
      if (response) {
        setTimeout(() => {
          showToast.success("Appointment booked Successfully.");
        }, 100);
        await handleFetchAppointments();
        navigate("/my-appointments");
      }
    } catch (error) {
      console.error("Failed to create appointment", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="flex justify-end w-full pr-16 mt-10  h-[80vh] relative">
      <div className="h-[20vh] w-[50vw] transform rotate-[32deg] bg-[#529CC7] absolute top-28 left-[-21vw] rounded-full"></div>
      <div className="w-[30%] h-[90vh] pr-16 flex justify-center">
        <BookAppointmentPic className="h-[85vh] relative bottom-10" />
      </div>
      <div className="w-[70%] h-[80vh]">
        <div className="bg-[#004A76] w-fit ml-10 rounded-t-xl">
          <h1 className="flex justify-start w-full p-2 text-3xl font-semibold text-white font-outfit">
            Let's Book An Appointment...!
          </h1>
        </div>
        <div
          className={`w-full h-[73vh] z-10 bg-[#65AED8] overflow-auto scroll-smooth overflow-y-scroll py-7 rounded-t-3xl flex flex-col items-start ${classes.noScrollbar} no-lenis-scroll scrollable-div`}
        >
          <form className="w-full h-full">
            <div className="flex flex-row justify-start w-full px-[10%] gap-[18%]">
              <div className="flex flex-col gap-1 w-[40%]">
                <label
                  htmlFor="doctor"
                  className="text-base font-medium font-outfit text-[#004A76]"
                >
                  Doctor Name :
                </label>
                <input
                  type="text"
                  id="doctor"
                  name="doctor"
                  value={formData.doctorName}
                  disabled
                  className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-1 mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
                />
              </div>
              <div className="flex flex-col w-[40%] gap-1">
                <label
                  htmlFor="patient"
                  className="text-base font-medium font-outfit text-[#004A76]"
                >
                  Patient Name :
                </label>
                <input
                  type="text"
                  id="patient"
                  name="patient"
                  value={user.name}
                  disabled
                  className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-1 mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
                />
              </div>
            </div>

            <div className="flex flex-row justify-start w-full px-[10%] gap-[18%]">
              <div className="flex flex-col items-center gap-1 w-[40%]">
                <label
                  htmlFor="appointmentDate"
                  className="text-base font-medium  w-full font-outfit text-[#004A76]"
                >
                  Appointment Date :
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-1 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
                />

                <div className="flex justify-center w-full h-full">
                  {loader && availableSlots.length === 0 ? (
                    <div className="flex flex-row items-center justify-center w-full gap-2 mt-10">
                      <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce"></div>
                      <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce [animation-delay:-.3s]"></div>
                      <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce [animation-delay:-.5s]"></div>
                    </div>
                  ) : null}

                  {!loader && availableSlots.length === 0 ? (
                    <button
                      className="px-5 text-lg bg-[#0075BC] h-fit w-fit mt-5 rounded-lg text-white font-medium font-outfit py-2 text-center hover:border-[#ffffff] hover:border-2"
                      onClick={showAvailableSlots}
                      disabled={loader}
                    >
                      Check Available Slots
                    </button>
                  ) : null}

                  {!loader && availableSlots.length > 0 ? (
                    <div className="w-full">
                      <label
                        htmlFor="availableSlots"
                        className="text-base font-medium font-outfit text-[#004A76]"
                      >
                        Available Slots:
                      </label>
                      <select
                        id="availableSlots"
                        name="availableSlots"
                        className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-2 focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
                        onChange={handleChange}
                      >
                        {availableSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col w-[40%] gap-1">
                <label
                  htmlFor="appointmentFee"
                  className="text-base font-medium font-outfit text-[#004A76]"
                >
                  Appointment Fee :
                </label>
                <input
                  type="text"
                  id="appointmentFee"
                  name="appointmentFee"
                  value={`$ ${formData.appointmentFee}`}
                  disabled
                  readOnly
                  className="px-2 text-lg bg-[#529CC7] w-[100%] rounded-md font-outfit py-1 mb-5 focus:outline-none focus:ring-2 focus:ring-[#0075BC]"
                />
                <div className="flex flex-row justify-center w-full gap-5 mt-5">
                  <button
                    className="px-5 text-lg bg-[#0075BC] h-fit w-fit rounded-lg text-white font-medium font-outfit py-2 text-center hover:border-[#ffffff] hover:border-2"
                    onClick={handlePayNow}
                  >
                    Pay Now
                  </button>
                  <button
                    className={`px-5 text-lg h-fit w-fit rounded-lg text-white font-medium font-outfit py-2 text-center hover:border-[#ffffff] hover:border-2 ${
                      selected ? "bg-[#004A76]" : "bg-[#0075BC]"
                    }`}
                    onClick={handlePayLater}
                  >
                    Pay Later
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start w-full my-2 px-[10%] gap-[18%]"></div>
            <div className="flex flex-col w-full mt-7 px-[10%]">
              <div className=" bg-[#4793c1] w-full rounded-lg px-[3%] py-2">
                <input
                  type="text"
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  placeholder={`What’s the main reason for your visit? (e.g., Fever, Headache).`}
                  className="px-2 text-lg bg-transparent border-b-2 border-[#004A76] placeholder:text-[#004b76cd] w-[100%] font-outfit py-1 mb-2 focus:outline-none "
                />

                <textarea
                  name="notes"
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Share more details about your concern (symptoms, duration, or related issues)."
                  className="bg-[#529CC7] resize-none h-[39vh] placeholder:text-[#004b76cd] text-lg font-outfit px-2 py-1 w-[100%] rounded-md focus:outline-none"
                ></textarea>
              </div>
              <div className="flex items-center justify-start w-full px-3 my-5">
                <input
                  type="checkbox"
                  id="termsAndConditions"
                  name="termsAndConditions"
                  onChange={handleChange}
                  className="mr-2"
                />
                <label
                  htmlFor="termsAndConditions"
                  className="text-[#004A76] flex font-outfit font-normal text-base"
                >
                  <p>
                    I agree to the{" "}
                    <Link
                      target="_blank"
                      to={"/terms-and-conditions"}
                      rel="noopener noreferrer"
                    >
                      <span className="text-[#0075BC] hover:underline">
                        {" "}
                        Terms and Conditions
                      </span>
                    </Link>
                  </p>
                </label>
              </div>
            </div>
            <div className="flex justify-center w-full gap-10 pb-5 pr-12">
              <button
                className="px-5 text-lg bg-[#0075BC] h-fit rounded-lg text-white font-medium font-outfit py-2 text-center hover:border-[#ffffff] hover:border-2"
                onClick={handleBookAppointment}
              >
                Book Appointment
              </button>

              <button
                className="px-5 text-lg bg-[#0075BC] h-fit rounded-lg text-white font-medium font-outfit py-2 text-center hover:border-[#ffffff] hover:border-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
