import React, { useEffect, useState } from "react";
import dashboardPic from "../../assets/DashboardPic.svg";
import dashboardBlob from "../../assets/dashboardBlob.svg";
import classes from "./Dashboard.module.css";
import DoctorAppointmentCard from "./DoctorAppointmentCard";
import { useSelector } from "react-redux";
import { format, parse } from "date-fns";
import axios from "axios";
import ContactCard from "../MyAppointmentPage/ContactCard";
import StatsCard from "./StatsCard";

const Dashboard = () => {
  const initialValue = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };
  const today = format(new Date(), "yyyy-MM-dd");
  const [isVisible, setIsVisible] = useState(false);
  const [contactDetails, setContactDetails] = useState(initialValue);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const appointments = useSelector((state) => state.appointments.appointments);
  const user = useSelector((state) => state.auth.user);
  const todaysAppointments = appointments.filter(
    (appointment) => appointment.appointmentDate.split("T")[0] === today
  );
  const sortedAppointments = [...todaysAppointments].sort((a, b) => {
    const statusOrder = {
      Scheduled: 1, // Priority 1: scheduled
      Completed: 2, // Priority 2: completed
      Canceled: 3, // Priority 3: canceled
    };
    return statusOrder[a.appointmentStatus] - statusOrder[b.appointmentStatus];
  });

  useEffect(() => {
    const scrollableDiv = document.querySelector(".scrollableDiv");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);
    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      fetchStats();
      fetchChartData();
    }
  }, []);

  const fetchChartData = async () => {
    try {
      const params = {
        doctorId: user.uid,
      };
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/appointments/chart-data",
        { params }
      );
      setChartData(response.data.weeks);
    } catch (error) {
      console.error("Failed to chart data", error.message);
    }
  };

  const fetchStats = async () => {
    const params = {
      doctorId: user.uid,
    };
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/appointments/stats",
        { params }
      );

      const {
        totalAppointments,
        appointmentsCanceled,
        appointmentsCompleted,
        totalRevenue,
        patientSatisfaction,
      } = response.data;

      setStats({
        totalAppointments,
        appointmentsCanceled,
        appointmentsCompleted,
        totalRevenue,
        patientSatisfaction,
      });
    } catch (error) {
      console.error("failed to fetch stats", error.message);
    }
  };

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

  const handleClose = () => {
    setContactDetails(initialValue);
    setIsVisible(false);
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
      <div className="relative flex w-full h-[85vh]">
        <img
          src={dashboardBlob}
          alt=""
          className="absolute h-[75%] top-[15%] left-[-1%]"
        />
        <div className="absolute top-0 overflow-hidden w-[50vw] h-full -right-10">
          <div className=" absolute h-[18vh] w-[50vw] rotate-[-30deg] top-[40%] right-[-25%] bg-[#529cc7] rounded-full"></div>
        </div>
        <div className="w-[30%] h-full  flex justify-center">
          <img src={dashboardPic} alt="" className="z-10 h-full" />
        </div>
        <div className="w-[40%] h-full px-5 ">
          <h1 className="mt-5 mb-2 text-4xl font-semibold text-white font-outfit">
            Today's Appointments
          </h1>
          <div
            className={`${classes.noScrollbar} scrollableDiv items-center w-full h-[74vh] overflow-y-scroll`}
          >
            {sortedAppointments.length > 0 ? (
              sortedAppointments.map((appointment, index) => {
                return (
                  <DoctorAppointmentCard
                    key={index}
                    patientId={appointment.patientId}
                    patientName={appointment.patientName}
                    date={format(
                      new Date(appointment.appointmentDate),
                      "do MMMM ,yyyy"
                    )}
                    time={format(
                      parse(appointment.appointmentTime, "HH:mm", new Date()),
                      "hh : mm a "
                    )}
                    paymentStatus={appointment.paymentStatus}
                    appointmentStatus={appointment.appointmentStatus}
                    problem={appointment.problem}
                    notes={appointment.notes}
                    handleContact={() => {
                      handleContact(appointment.patientId);
                    }}
                    id={appointment._id}
                  />
                );
              })
            ) : (
              <div className="flex flex-col items-start h-full pr-10 mt-10 text-white">
                <h2 className="text-2xl font-bold">
                  No Appointments Today...!
                </h2>
                <p className="mt-2 text-white">
                  You have no scheduled appointments for today. Relax and stay
                  prepared for upcoming bookings.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-[30%] px-5 h-full flex items-center justify-center">
          <StatsCard
            totalAppointments={stats.totalAppointments}
            appointmentsCanceled={stats.appointmentsCanceled}
            appointmentsCompleted={stats.appointmentsCompleted}
            totalRevenue={stats.totalRevenue}
            chartData={chartData}
            patientSatisfaction={stats.patientSatisfaction}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
