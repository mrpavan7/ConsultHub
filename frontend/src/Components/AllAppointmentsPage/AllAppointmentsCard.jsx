import React, { useEffect, useState } from "react";
import userDefault from "../../assets/userDefaultProfile.svg";
import classes from "./AllAppointments.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { format, parse } from "date-fns";
import { fetchAppointments } from "../../features/appointments/appointment.slice";
import { showToast } from "../../config/toastConfig";

const AllAppointmentsCard = ({
  patientId,
  patientName,
  date,
  time,
  problem,
  notes,
  paymentStatus,
  appointmentStatus,
  doctorId,
  handleContact,
  id,
}) => {
  const [nextVisitData, setNextVisitData] = useState({
    date: "",
    slot: "",
  });

  const [loading, setLoading] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [userPic, setUserPic] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

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
      console.log("successfully fetched available slot :", response.data);
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
    patientId && fetchProfileImage();
  }, [patientId]);

  useEffect(() => {
    if (date && doctorId) {
      fetchNextAvailableSlots();
    }
  }, [date, doctorId]);

  if (loading) {
    return (
      <div className="h-52 w-[40rem] flex items-center justify-center">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-[#004A76] animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-52 w-[40rem] bg-[#B3E5F6] flex relative rounded-2xl mb-12">
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
      <div className="absolute z-20 flex items-center -top-8 left-5">
        <div className="z-10 h-16 border-[3px] border-[#0075BC] bg-[#0075BC] rounded-full aspect-square">
          <img
            src={userPic ? userPic : userDefault}
            alt="patient-profile"
            className="rounded-full"
          />
        </div>
        <div className="text-xl font-medium text-white bg-[#0075BC] px-2 py-[3px] pl-4 relative right-2 rounded-r-lg font-outfit">
          <p>{patientName ? patientName : "Patient Name"}</p>
        </div>
      </div>
      <div className="text-lg font-medium gap-3 text-white z-10 bg-[#0075BC] flex px-4 py-[3px] absolute -top-4 right-10 w-fit rounded-full font-outfit">
        <p>{date ? date : "Date"}</p>
        <p>{time ? time : "Time"}</p>
      </div>
      <div className="w-[55%] h-full flex items-end py-4 pl-4">
        <div className="w-full h-[85%] bg-[#65AED8] bg-opacity-50 rounded-xl flex flex-col p-2">
          <div className="flex items-center gap-1">
            <h2 className="text-base font-semibold text-[#004A76] font-outfit">
              Problem :
            </h2>

            <p className="text-sm font-medium font-outfit">
              {problem ? problem : "Not Provided"}
            </p>
          </div>
          <div className="flex h-[75%] flex-col w-full">
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
      </div>
      <div className="w-[50%] pt-10 h-full flex flex-col justify-center p-5 pl-10">
        <h1 className="text-[#004A76] font-bold text-base">
          Next visit suggested :
        </h1>
        <div className="mb-2">
          <p className="text-base font-medium text-[#333a43]">
            {nextVisitData.date ? nextVisitData.date : "Date"}
          </p>
          <p className="text-base font-medium text-[#333a43]">
            {nextVisitData.slot ? nextVisitData.slot : "Time"}
          </p>
        </div>
        <div className="flex gap-1 text-base font-bold font-outfit">
          <p className="text-[#4B5563]">Payment Status : </p>
          {paymentStatus === "Paid" ? (
            <p className="text-[#0FBF00]">Paid</p>
          ) : (
            <p className="text-[#bf0000c0]">Pending</p>
          )}
        </div>
        <div className="flex w-full gap-1 mb-1 text-base font-bold font-outfit">
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
            <p className="text-[#bf0000c0]">Pending</p>
          ) : null}
        </div>
        <div className="flex justify-end gap-7">
          <button
            className="bg-[#0075BC] text-white font-semibold px-2 py-1 mt-1 rounded-lg font-outfit"
            disabled={appointmentStatus === "Canceled"}
            onClick={handleContact}
          >
            Contact
          </button>
          {appointmentStatus === "Scheduled" || !appointmentStatus ? (
            <button
              className="bg-[#0075BC] text-white font-outfit font-semibold px-2 py-1 mt-1 rounded-lg"
              disabled={appointmentStatus === "Canceled"}
              onClick={() => setIsFlagged(true)}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AllAppointmentsCard;
