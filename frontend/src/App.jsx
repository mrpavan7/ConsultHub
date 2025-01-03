import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import DoctorsPage from "./Pages/DoctorsPage";
import Navbar from "./Components/Navbar/Navbar";
import AboutPage from "./Pages/AboutPage";
import Footer from "./Components/Footer/Footer";
import ContactPage from "./Pages/ContactPage";
import SignInPage from "./Pages/SignInPage";
import LogInPage from "./Pages/LogInPage";
import { useSmoothScroll } from "./Components/ScrollToTop/SmoothScroll";
import ScrollToTopBtn from "./Components/ScrollToTop/ScrollToTopBtn";
import DocProfilePage from "./Pages/DocProfilePage";
import DoctorForm from "./Components/SignInPage/DoctorForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchDoctors } from "./features/doctors/doctors.slice";
import Loading from "./Components/LoadingPage/Loading";
import MyProfilePage from "./Pages/MyProfilePage";
import Popup from "./Components/Popup/Popup";
import { auth } from "./firebase/firebase";
import { fetchUserByUID } from "./features/Auth/auth.slice";
import { onAuthStateChanged } from "firebase/auth";
import AppointmentForm from "./Components/DoctorsPage/AppointmentForm/AppointmentForm";
import TermsAndConditions from "./Components/Terms/Terms";
import { fetchAppointments } from "./features/appointments/appointment.slice";
import MyAppointmentPage from "./Pages/MyAppointmentPage";
import DashboardPage from "./Pages/DashboardPage";
import AllAppointmentsPage from "./Pages/AllAppointmentsPage";
import DoctorProfilePage from "./Pages/DoctorProfilePage";
import AllPatients from "./Components/AllPatients/AllPatients";
import { Bounce, ToastContainer } from "react-toastify";
import FAQPage from "./Pages/FAQPage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import NotFoundPage from "./Pages/NotFoundPage";

function App() {
  const location = useLocation();
  useSmoothScroll();
  const dispatch = useDispatch();
  const { status: doctorsStatus, error: doctorsError } = useSelector(
    (state) => state.doctors
  );
  const {
    appointments,
    status: appointmentsStatus,
    error: appointmentsError,
  } = useSelector((state) => state.appointments);
  const { loading: userLoading } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.ui.loading);
  const user = useSelector((state) => state.auth.user);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();

  //Fetch the user data if already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(fetchUserByUID(user.uid));
      }
    });
    return unsubscribe;
  }, [dispatch]);

  //navigate doctor to dashboard
  useEffect(() => {
    if (!flag && user && user.role === "Doctor") {
      navigate("/dashboard");
      setFlag(true);
    }
  }, [navigate, user]);

  // Fetch doctors on initial load
  useEffect(() => {
    if (doctorsStatus === "idle") {
      dispatch(fetchDoctors());
    }
  }, [dispatch]);

  //Fetch appointments if have any on initial load
  useEffect(() => {
    if (user && user.role !== "Guest") {
      const { role, uid } = user;
      dispatch(fetchAppointments({ role, uid }));
    }
  }, [dispatch, user]);

  // Handle loading and error globally
  if (
    userLoading ||
    doctorsStatus === "pending" ||
    appointmentsStatus === "Pending"
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#4793c1]">
        <Loading />
      </div>
    );
  }

  if (doctorsError === "error" || appointmentsError === "error") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#4793c1]">
        <p>Error: {doctorsError ? doctorsError : appointmentsError}</p>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <Loading />
        </>
      ) : (
        <div className={`bg-[#4793c1] min-h-lvh px-10`}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <Popup />
          <Navbar location={location.pathname} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={<DoctorsPage key={location.state} />}
            />
            <Route
              path="/doctors/doctor-profile"
              element={<DocProfilePage />}
            />
            <Route
              path="/doctors/doctor-profile/appointment-form"
              element={<AppointmentForm />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-in/doctor-form" element={<DoctorForm />} />
            <Route
              path="/doctor-profile/doctor-form"
              element={<DoctorForm />}
            />
            <Route path="/log-in" element={<LogInPage />} />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute allowedRoles={["Patient"]}>
                  <MyAppointmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-appointments"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <AllAppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/doctor-profile" element={<DoctorProfilePage />} />
            <Route path="/all-patients" element={<AllPatients />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <ScrollToTopBtn />
        </div>
      )}
    </>
  );
}

export default App;
