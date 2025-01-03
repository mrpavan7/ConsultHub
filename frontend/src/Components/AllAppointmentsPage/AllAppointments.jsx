import React, { useEffect, useState } from "react";
import allAppointmentsBlobRight from "../../assets/allAppointmentsBlobRight.svg";
import allAppointmentsPic from "../../assets/allAppointmentsPic.svg";
import AllAppointmentsCard from "./AllAppointmentsCard";
import classes from "./AllAppointments.module.css";
import { useSelector } from "react-redux";
import { format, parse } from "date-fns";
import axios from "axios";
import ContactCard from "../MyAppointmentPage/ContactCard";

const AllAppointments = () => {
  useEffect(() => {
    const scrollableDiv = document.querySelector(".scrollableDiv");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);
    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  const initialValue = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const appointments = useSelector((state) => state.appointments.appointments);
  const [order, setOrder] = useState("newest");
  const [isVisible, setIsVisible] = useState(false);
  const [contactDetails, setContactDetails] = useState(initialValue);
  const user = useSelector((state) => state.auth.user);

  const sortedAppointments = [...appointments].sort((a, b) => {
    // Create combined datetime for sorting
    const dateTimeA = new Date(
      new Date(a.appointmentDate).toISOString().split("T")[0] +
        "T" +
        a.appointmentTime
    );
    const dateTimeB = new Date(
      new Date(b.appointmentDate).toISOString().split("T")[0] +
        "T" +
        b.appointmentTime
    );

    // Compare the datetime objects
    return order === "oldest" ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
  });

  const fetchUser = async (patientId) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/users/" + patientId
      );
      console.log("Successfully fetched user.");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch user", error.message);
    }
  };

  const handleContact = async (patientId) => {
    if (!patientId) {
      console.log("please provide doctorId");
      return;
    }

    const user = await fetchUser(patientId);

    if (!user) {
      console.log("No doctor found");
      return;
    }

    const data = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };

    setContactDetails(data);
    setIsVisible(true);
  };

  const handleClose = () => {
    setContactDetails(initialValue);
    setIsVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "order") {
      setOrder(value);
    }
  };

  return (
    <>
      {isVisible ? (
        <ContactCard
          name={contactDetails.name}
          email={contactDetails.email}
          phone={contactDetails.phone}
          address={contactDetails.address}
          handleClose={handleClose}
        />
      ) : null}
      <div className="h-[90vh] w-full flex">
        <div className="h-full w-[55%]">
          <div className="bg-[#0075BC] w-fit py-3 px-7 pl-16 transform -translate-x-10 rounded-r-full">
            <h1 className="text-5xl font-bold text-white font-outfit">
              All Appointments
            </h1>
          </div>
          <div className="w-full">
            <select
              name="order"
              id="order"
              onChange={handleChange}
              className="bg-[#0075BC] py-1 px-2 m-2 rounded-md text-xl font-semibold text-white focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div className="flex justify-center w-full h-fit ">
            <div
              className={`${classes.noScrollbar} scrollableDiv pt-10 w-fit h-[70vh] overflow-y-scroll`}
            >
              {sortedAppointments.length > 0 ? (
                sortedAppointments.map((appointment, index) => (
                  <AllAppointmentsCard
                    key={index}
                    patientName={appointment.patientName}
                    date={format(
                      new Date(appointment.appointmentDate),
                      "dd MMMM ,yyyy"
                    )}
                    time={format(
                      parse(appointment.appointmentTime, "HH:mm", new Date()),
                      "hh : mm a "
                    )}
                    problem={appointment.problem}
                    notes={appointment.notes}
                    paymentStatus={appointment.paymentStatus}
                    appointmentStatus={appointment.appointmentStatus}
                    patientId={appointment.patientId}
                    id={appointment._id}
                    doctorId={appointment.doctorId}
                    handleContact={() => handleContact(appointment.patientId)}
                  />
                ))
              ) : (
                <div className="mt-10 text-center w-[80%] text-white">
                  <h2 className="text-3xl font-semibold">
                    No Appointments Found
                  </h2>
                  <p className="mt-2 text-lg text-white">
                    You have no appointments scheduled. Once appointments are
                    booked, they will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-[85vh] w-[45%] grid place-items-center">
          <img
            src={allAppointmentsBlobRight}
            alt=""
            className="w-full h-[80%] col-start-1 col-end-2 row-start-1 row-end-2"
          />
          <img
            src={allAppointmentsPic}
            alt=""
            className="z-10 h-[95%] col-start-1 col-end-2 row-start-1 row-end-2"
          />
        </div>
      </div>
    </>
  );
};

export default AllAppointments;
