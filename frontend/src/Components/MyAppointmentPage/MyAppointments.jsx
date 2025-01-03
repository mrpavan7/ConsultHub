import React, { useEffect, useState } from "react";
import { MyAppointmentsPic } from "../../svg/MyAppointmentsPic.svg";
import MyAppointmentCard from "./MyAppointmentCard";
import docAvatar1 from "../../assets/docAvatar1.svg";
import docAvatar2 from "../../assets/docAvatar2.svg";
import docAvatar3 from "../../assets/docAvatar3.svg";
import docAvatar4 from "../../assets/docAvatar4.svg";
import docAvatar5 from "../../assets/docAvatar5.svg";
import docAvatar6 from "../../assets/docAvatar6.svg";
import docAvatar7 from "../../assets/docAvatar7.svg";
import docAvatar8 from "../../assets/docAvatar8.svg";
import docAvatar9 from "../../assets/docAvatar9.svg";
import docAvatar10 from "../../assets/docAvatar10.svg";
import docAvatar11 from "../../assets/docAvatar11.svg";
import docAvatar12 from "../../assets/docAvatar12.svg";
import { useDispatch, useSelector } from "react-redux";
import { format, parse } from "date-fns";
import ContactCard from "./ContactCard";
import { useNavigate } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import axios from "axios";
import { setLoading } from "../../features/Ui/ui.slice";
import { fetchAppointments } from "../../features/appointments/appointment.slice";
import { showToast } from "../../config/toastConfig";

const MyAppointments = () => {
  useEffect(() => {
    const scrollableDiv = document.querySelector(".scrollable-div");
    const stopPropagation = (event) => event.stopPropagation();
    scrollableDiv.addEventListener("wheel", stopPropagation);
    return () => {
      scrollableDiv.removeEventListener("wheel", stopPropagation);
    };
  }, []);

  const avatars = [
    docAvatar1,
    docAvatar2,
    docAvatar3,
    docAvatar4,
    docAvatar5,
    docAvatar6,
    docAvatar7,
    docAvatar8,
    docAvatar9,
    docAvatar10,
    docAvatar11,
    docAvatar12,
  ];

  const appointments = useSelector((state) => state.appointments.appointments);
  const doctors = useSelector((state) => state.doctors.doctors);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const initialValue = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };

  const initialReview = {
    rating: null,
    feedback: "",
    appointmentId: "",
    patientId: "",
    doctorId: "",
  };

  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(null);
  const [contactDetails, setContactDetails] = useState(initialValue);
  const [order, setOrder] = useState("newest");
  const [reviewVisibility, setReviewVisibility] = useState(false);
  const [reviewDetails, setReviewDetails] = useState(initialReview);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "order") {
      setOrder(value);
    }

    if (name === "feedback") {
      setReviewDetails({ ...reviewDetails, feedback: value });
    }
  };

  const updatedAppointments = appointments.map((appointment, index) => {
    return {
      ...appointment,
      appointmentAvatar: avatars[index % avatars.length],
    };
  });

  const sortedAppointments = [...updatedAppointments].sort((a, b) => {
    // Create combined datetime for sorting
    const dateTimeA = new Date(new Date(a.createdAt));
    const dateTimeB = new Date(new Date(b.createdAt));

    // Compare the datetime objects
    return order === "oldest" ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
  });

  const handleContact = (doctorId) => {
    if (!doctorId) {
      console.log("please provide doctorId");
      return;
    }
    const doctor = doctors.find((doctor) => doctor.doctorId === doctorId);

    if (!doctor) {
      console.log("No doctor found");
      return;
    }
    console.log(doctor);

    const data = {
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      address: doctor.address,
    };

    setContactDetails(data);
    setIsVisible(true);
  };

  const handleClose = () => {
    setContactDetails(initialValue);
    setIsVisible(false);
    setReviewDetails(initialReview);
    setReviewVisibility(false);
    setRating(0);
  };

  const handlePay = () => {
    showToast.info(
      "The 'Pay Fees' feature is currently under development. please pay the fees at the time of appointment"
    );
  };

  const handleBookAppointment = () => {
    navigate("/doctors");
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

  const handleRating = (starValue) => {
    setRating(starValue);
    setReviewDetails({ ...reviewDetails, rating: starValue });
  };

  const handleReview = (appointmentId, patientId, doctorId) => {
    setReviewVisibility(true);
    setReviewDetails({
      ...reviewDetails,
      appointmentId: appointmentId,
      patientId: patientId,
      doctorId: doctorId,
    });
  };

  const handleReviewSubmit = async () => {
    if (reviewDetails?.rating === null) {
      setTimeout(() => {
        showToast.warning(
          "Please provide a rating before submitting your review."
        );
      }, 100);
      return;
    }
    try {
      dispatch(setLoading(true));
      const review = { ...reviewDetails };
      const response = await axios.post(
        import.meta.env.VITE_BASE_API + "/reviews",
        review
      );
      setTimeout(() => {
        showToast.success(
          "Thank you for your review! Your feedback has been submitted successfully."
        );
      }, 100);
      await handleFetchAppointments();
      setLoading(false);
    } catch (error) {
      console.error("Failed to send review.", error.message);
      setTimeout(() => {
        showToast.error(
          "Failed to submit your review. Please try again later."
        );
      }, 100);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      {isVisible ? (
        <ContactCard
          name={contactDetails.name}
          email={contactDetails.email}
          phone={contactDetails.phone}
          address={contactDetails.address}
          handleClose={handleClose}
        />
      ) : null}
      {reviewVisibility ? (
        <ReviewCard
          handleChange={handleChange}
          handleClose={handleClose}
          feedback={reviewDetails.feedback}
          handleSubmit={handleReviewSubmit}
          rating={rating}
          handleRating={handleRating}
        />
      ) : null}
      <div className="bg-[#0075BC] w-fit px-14 py-4 rounded-r-full relative right-10 top-7 pl-20">
        <h1 className="text-5xl font-bold text-white font-outfit">
          My Appointments
        </h1>
      </div>
      <div className="flex flex-row w-full mt-10 h-[85vh] ">
        <div
          className={`noScrollbar h-[85vh] overflow-y-scroll min-w-[38rem] w-[60%] scrollable-div`}
        >
          {appointments.length !== 0 ? (
            <div className="w-full">
              <select
                name="order"
                id="order"
                value={order}
                onChange={handleChange}
                className="bg-[#0075BC] py-1 px-2 m-2 rounded-md text-xl font-semibold text-white focus:outline-none"
              >
                <option value="oldest">Oldest</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          ) : null}
          <div className="flex flex-col items-center w-full gap-16 my-10 h-fit">
            {appointments.length === 0 ? (
              <div className="mt-20 text-center">
                <p className="text-xl font-medium text-white font-outfit">
                  You currently have no appointments booked.
                </p>
                <p className="mt-2 text-xl font-medium text-white font-outfit">
                  Schedule your appointment today by clicking the button below.
                </p>
                <button
                  className="bg-[#0075BC] text-white text-xl font-bold py-2 px-4 mt-6 rounded-md hover:border-2 hover:border-white transition duration-300"
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </button>
              </div>
            ) : (
              sortedAppointments.map((appointment, index) => {
                return (
                  <MyAppointmentCard
                    key={index}
                    docName={appointment.doctorName}
                    speciality={appointment.speciality}
                    date={format(
                      new Date(appointment.appointmentDate),
                      "dd MMMM ,yyyy"
                    )}
                    docAvatar={appointment.appointmentAvatar}
                    time={format(
                      parse(appointment.appointmentTime, "HH:mm", new Date()),
                      "hh : mm a "
                    )}
                    problem={appointment.problem}
                    notes={appointment.notes}
                    appointmentStatus={appointment.appointmentStatus}
                    handleContact={() => {
                      handleContact(appointment.doctorId);
                    }}
                    handlePay={handlePay}
                    paymentStatus={appointment.paymentStatus}
                    id={appointment._id}
                    doctorId={appointment.doctorId}
                    review={appointment.review}
                    handleReview={() =>
                      handleReview(
                        appointment._id,
                        appointment.patientId,
                        appointment.doctorId
                      )
                    }
                  />
                );
              })
            )}
          </div>
        </div>
        <div className="h-full w-[40%]">
          <MyAppointmentsPic className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
