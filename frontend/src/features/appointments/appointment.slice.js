import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  appointments: [],
  status: "idle",
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async ({ role, uid, appointmentDate }, { rejectWithValue }) => {
    try {
      if (!uid || !role) {
        console.log("please provide required details");
        return rejectWithValue("Missing required parameters");
      }
      const params = {};
      if (appointmentDate) {
        params.appointmentDate = appointmentDate;
      }
      if (role === "Patient") {
        params.patientId = uid;
      } else {
        params.doctorId = uid;
      }

      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/appointments/fetch-appointments",
        { params }
      );

      return response.data.appointments;
    } catch (error) {
      console.log(
        "Error while fetching appointments (in redux)",
        error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    addAppointment: (state, action) => {
      const appointment = {
        id: nanoid(),
        doctorId: action.payload,
      };
      state.appointments.push(appointment);
    },
    removeAppointment: (state, action) => {
      state.appointments = state.appointments.filter((appointment) => {
        appointment.id !== action.payload;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAppointments.pending, (state) => {
      state.status = "Pending";
    });
    builder.addCase(fetchAppointments.fulfilled, (state, action) => {
      state.status = "Succeeded";
      state.appointments = action.payload;
    });
    builder.addCase(fetchAppointments.rejected, (state, action) => {
      state.status = "Failed";
      state.error = action.payload;
    });
  },
});

export const { addAppointment, removeAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;
