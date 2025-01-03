import { configureStore } from "@reduxjs/toolkit";
import appointmentReducers from "../features/appointments/appointment.slice.js";
import doctorReducers from "../features/doctors/doctors.slice.js";
import authReducers from "../features/Auth/auth.slice.js";
import uiReducers from "../features/Ui/ui.slice.js";

const store = configureStore({
  reducer: {
    appointments: appointmentReducers,
    doctors: doctorReducers,
    auth: authReducers,
    ui: uiReducers,
  },
});

export default store;
