import React, { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";
import userDefault from "../../assets/userDefaultProfile.svg";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../features/appointments/appointment.slice";
import { showToast } from "../../config/toastConfig";

const DoctorAppointmentCard = ({
  patientId,
  patientName,
  date,
  time,
  paymentStatus,
  appointmentStatus,
  problem,
  notes,
  handleContact,
  id,
}) => {
  const [loading, setLoading] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [userPic, setUserPic] = useState("");

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
          showToast.success("Successfully Canceled appointment.");
        }, 100);
        await handleFetchAppointments();
      } else {
        setTimeout(() => {
          showToast.error("Error while canceling appointment.");
        }, 100);
      }
    } catch (error) {
      setTimeout(() => {
        showToast.error("Unable to cancel appointment. Please try again.");
      }, 100);
    } finally {
      setLoading(false);
    }
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

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/users/" + patientId
      );
      setUserPic(response.data.data.photo);
    } catch (error) {
      console.error("Failed to fetch Profile Image", error.message);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, [patientId]);

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
    <div className="h-[25vh] bg-[#B3E5F6] w-full mt-10 rounded-2xl flex relative">
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
      <div className="h-full w-[45%]">
        <div className="relative z-20 flex items-center bottom-8 left-5">
          <div className="z-10 h-16 border-[3px] border-[#0075BC] bg-[#0075BC] rounded-full aspect-square">
            <img
              src={userPic ? userPic : userDefault}
              alt=""
              className="rounded-full"
            />
          </div>
          <div className="text-xl font-medium text-white bg-[#0075BC] px-2 py-[3px] pl-4 relative right-2 rounded-r-lg font-outfit">
            <p>{patientName ? patientName : "Patient Name"}</p>
          </div>
        </div>
        <div className="relative pl-5 text-lg font-medium mb-1  text-[#4B5563] bottom-4 font-outfit">
          <p>{date ? date : "Appointment Date"}</p>
          <p>{time ? time : "Appointment Time"}</p>
        </div>
        <div className="relative flex gap-1 pl-5 mt-4 text-lg font-medium bottom-5 font-outfit">
          <p className="text-[#4B5563]">Payment Status : </p>
          {paymentStatus === "Paid" ? (
            <p className="text-[#0FBF00]">Paid</p>
          ) : (
            <p className="text-[#bf0000c0]">Pending</p>
          )}
        </div>
        <div className="relative flex w-[130%] gap-1 text-lg font-medium pl-5 bottom-5 font-outfit">
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
      <div className="h-full w-[55%] px-3 py-2 flex flex-col justify-center">
        <div className="h-[75%] w-full relative p-1 px-2 rounded-xl bg-[#65AED8] bg-opacity-50 flex flex-col">
          <div className="flex items-center gap-1">
            <h2 className="text-base font-semibold text-[#004A76] font-outfit">
              Problem :
            </h2>

            <p className="text-sm font-medium font-outfit">
              {problem ? problem : "Not Provided"}
            </p>
          </div>
          <div className="flex h-[80%] flex-col w-full">
            <h2 className="text-base font-semibold text-[#004A76] font-outfit mt-1">
              Description :
            </h2>

            <p
              className={`${classes.noScrollbar} overflow-y-scroll text-sm font-outfit font-medium text-[#333a43] `}
            >
              {notes ? notes : "Description Not Provided"}
            </p>
          </div>
        </div>
        <div className="h-[30%] w-full flex flex-row items-center gap-4 justify-end pr-1">
          <button
            className="bg-[#0075BC] text-white font-semibold px-2 py-1 mt-1 rounded-lg font-outfit"
            onClick={handleContact}
            disabled={appointmentStatus === "Canceled"}
          >
            Contact
          </button>
          {appointmentStatus === "Scheduled" || !appointmentStatus ? (
            <button
              className="bg-[#0075BC] text-white font-outfit font-semibold px-2 py-1 mt-1 rounded-lg"
              onClick={() => setIsFlagged(true)}
              disabled={appointmentStatus === "Canceled"}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentCard;
