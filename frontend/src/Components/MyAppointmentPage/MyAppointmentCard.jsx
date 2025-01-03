import React, { useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import docAvatar9 from "../../assets/docAvatar9.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../features/appointments/appointment.slice";
import { format, parse } from "date-fns";
import { showToast } from "../../config/toastConfig.js";

const MyAppointmentCard = ({
  docName,
  speciality,
  date,
  time,
  paymentStatus,
  appointmentStatus,
  problem,
  notes,
  docAvatar,
  handleContact,
  handlePay,
  doctorId,
  handleReview,
  id,
  review,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [formData, setFormData] = useState({
    problem: problem,
    notes: notes,
  });
  const [nextVisitData, setNextVisitData] = useState({
    date: "",
    slot: "",
  });

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleCancelAppointment = async () => {
    setLoading(true);
    const updates = {
      appointmentStatus: "Canceled",
    };
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_API + "/appointments/" + id,
        updates
      );

      if (response.status === 200) {
        setTimeout(() => {
          showToast.success("Successfully canceled appointment.");
        }, 100);
        await handleFetchAppointments();
      } else {
        setTimeout(() => {
          showToast.error("Error while canceling appointment.");
        }, 100);
      }
    } catch (error) {
      console.error("Failed to cancel appointment", error.message);
      setInterval(() => {
        showToast.error("Unable to cancel the appointment. Please try again.");
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_BASE_API + "/appointments/" + id,
        formData
      );

      if (response.status === 200) {
        setTimeout(() => {
          showToast.success("Successfully updated appointment.");
        }, 100);
        await handleFetchAppointments();
      } else {
        setTimeout(() => {
          showToast.error("Error while updating appointment.");
        }, 100);
      }
    } catch (error) {
      console.error("Failed to update appointment", error.message);
      setTimeout(() => {
        showToast("Unable to update appointment please try again.");
      }, 100);
    } finally {
      setIsEditable(false);
    }
  };

  const fetchNextAvailableSlots = async () => {
    const data = {
      appointmentDate: date,
      doctorId: doctorId,
    };

    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/appointments/first-available-slot",
        {
          params: data,
        }
      );
      const date = format(new Date(response.data.date), "dd MMMM ,yyyy");
      const slot = format(
        parse(response.data.slot, "HH:mm", new Date()),
        "hh : mm a "
      );
      setNextVisitData({ date, slot });
    } catch (error) {
      console.error("Error in fetching available slot :", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      return null;
    }
  };

  useEffect(() => {
    if (date && doctorId) {
      fetchNextAvailableSlots();
    }
  }, [date, doctorId]);

  if (loading) {
    return (
      <div className="h-44 w-[35rem] flex items-center justify-center">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-52 bg-[#B3E5F6] w-[38rem] rounded-2xl flex relative">
      {appointmentStatus === "Canceled" ? (
        <div className="absolute top-0 left-0 w-full h-full bg-[#80808037] rounded-2xl z-10"></div>
      ) : null}
      {isFlagged ? (
        <div className="absolute top-0 text-white flex flex-col items-center text-center justify-center gap-3 left-0 w-full h-full bg-[#000000be] rounded-2xl z-10">
          <p className="mt-2 text-lg font-medium">
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </p>
          <div className="flex w-full font-medium justify-evenly">
            <button
              className="bg-[#0075BC] px-3 py-2 rounded-md"
              onClick={() => setIsFlagged(false)}
            >
              No, Keep Appointment
            </button>
            <button
              className="bg-[#0075BC] px-3 py-2 rounded-md"
              onClick={handleCancelAppointment}
            >
              Yes, Cancel Appointment
            </button>
          </div>
        </div>
      ) : null}
      <div className="h-full w-[45%] flex flex-col justify-center mt-4">
        <div className="absolute z-20 flex items-center -top-8 left-5">
          <div className="z-10 h-16 border-[3px] border-[#0075BC] bg-red-300 rounded-full aspect-square">
            <img src={docAvatar ? docAvatar : docAvatar9} alt="" />
          </div>
          <div className="text-xl font-medium text-white bg-[#0075BC] px-2 py-[3px] pl-4 relative right-2 rounded-r-lg font-outfit">
            <p>{docName ? docName : "Doctor Name"}</p>
          </div>
        </div>
        <div className=" absolute w-full top-4 text-[#4B5563] left-20 pl-3 text-base font-normal font-outfit">
          <h2>{speciality ? speciality : "Doctor Speciality"}</h2>
        </div>
        <div className="absolute flex px-3 rounded-full z-10 bg-[#0075BC] text-white font-outfit font-semibold py-1 gap-4 -top-4 right-5">
          <p>{date ? format(date, "do MMMM ,yyyy") : "Appointment Date"}</p>
          <p>{time ? time : "Appointment Time"}</p>
        </div>
        <div className="pl-5 text-lg font-medium mb-2 text-[#4B5563] font-outfit">
          <h2 className="text-[#004A76] font-semibold text-lg">
            Next Visit Suggested :
          </h2>
          <p>{nextVisitData.date ? nextVisitData.date : "Date"}</p>
          <p>{nextVisitData.slot ? nextVisitData.slot : "Time"}</p>
        </div>
        <div className="relative flex gap-1 pl-5 text-lg font-medium font-outfit">
          <p className="text-[#4B5563]">Payment Status : </p>
          {paymentStatus === "Paid" ? (
            <p className="text-[#0FBF00]">Paid</p>
          ) : (
            <p className="text-[#bf0000c0]">Pending</p>
          )}
        </div>
        <div className="relative flex w-[110%] gap-1 text-lg font-medium pl-5 font-outfit">
          <p className="text-[#4B5563]">Appointment Status : </p>
          {appointmentStatus === "Scheduled" ? (
            <p className="text-[#3498db]">Scheduled</p>
          ) : null}
          {appointmentStatus === "Completed" ? (
            <p className="text-[#10bf00c0]">Completed</p>
          ) : null}
          {appointmentStatus === "Canceled" ? (
            <p className="text-[#bf0000c0]">Canceled</p>
          ) : null}
          {appointmentStatus !== "Canceled" &&
          appointmentStatus !== "Completed" &&
          appointmentStatus !== "Scheduled" ? (
            <p className="text-[#bf0000c0]">Not Available</p>
          ) : null}
        </div>
      </div>
      <div className="h-full w-[60%] px-3 mt-4 py-2 flex flex-col justify-center">
        <div className="h-[70%] w-full mt-1 relative p-1 px-2 rounded-xl bg-[#65AED8] bg-opacity-50 flex flex-col">
          <div className="flex items-center gap-1">
            <h2 className="text-base font-semibold text-[#004A76] font-outfit">
              Problem :
            </h2>
            {!isEditable ? (
              <p className="text-sm font-medium font-outfit">
                {problem ? problem : "Not Provided"}
              </p>
            ) : (
              <input
                type="text"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                id="problem"
                className="text-sm font-medium border-b-2 font-outfit border-[#004A76] px-1 w-[45%] bg-transparent focus:outline-none"
              />
            )}

            {!isEditable && appointmentStatus === "Scheduled" ? (
              <button
                className="absolute right-3 top-2 bg-[#0075BC] text-white font-semibold px-2 py-[2px] rounded-lg flex items-center justify-center gap-2"
                onClick={handleEditClick}
              >
                Edit
                <MdModeEditOutline />
              </button>
            ) : null}
            {isEditable ? (
              <button className="absolute right-8 text-[#0075BC] text-xl font-semibold px-2 py-[4px] rounded-lg flex items-center justify-center">
                <FaSave onClick={handleSaveClick} />
              </button>
            ) : null}
            {isEditable ? (
              <button className="absolute right-1 text-[#0075BC] text-xl font-semibold px-2 py-[4px] rounded-lg flex items-center justify-center">
                <IoClose onClick={handleCancelClick} />
              </button>
            ) : null}
          </div>
          <div className="flex h-[80%] flex-col w-full">
            <h2 className="text-base font-semibold text-[#004A76] font-outfit mt-1">
              Description :
            </h2>
            {!isEditable ? (
              <p
                className={`noScrollbar overflow-y-scroll text-sm font-outfit font-medium text-[#333a43] `}
              >
                {notes ? notes : "Description Not Provided"}
              </p>
            ) : (
              <textarea
                name="notes"
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                className={`noScrollbar text-sm pl-1 font-outfit font-medium text-[#333a43] h-full bg-[#0074bc3b] rounded-md focus:outline-none resize-none`}
              ></textarea>
            )}
          </div>
        </div>
        <div className="h-[30%] mb-2 w-full flex flex-row items-center gap-4 justify-end pr-1">
          {paymentStatus === "Pending" ? (
            <button
              className="bg-[#0075BC] text-white font-semibold px-2 py-1 mt-1 rounded-lg font-outfit"
              onClick={handlePay}
              disabled={appointmentStatus === "Canceled"}
            >
              Pay Fees
            </button>
          ) : null}
          <button
            className="bg-[#0075BC] text-white font-semibold px-2 py-1 mt-1 rounded-lg font-outfit"
            onClick={handleContact}
            disabled={appointmentStatus === "Canceled"}
          >
            Contact
          </button>
          {appointmentStatus === "Scheduled" ? (
            <button
              className="bg-[#0075BC] text-white font-outfit font-semibold px-2 py-1 mt-1 rounded-lg"
              onClick={() => setIsFlagged(true)}
              disabled={appointmentStatus === "Canceled"}
            >
              Cancel
            </button>
          ) : null}
          {appointmentStatus === "Completed" && !review ? (
            <button
              className="bg-[#0075BC] text-white font-outfit font-semibold px-2 py-1 mt-1 rounded-lg"
              onClick={handleReview}
              disabled={appointmentStatus === "Canceled"}
            >
              Give Review
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentCard;
