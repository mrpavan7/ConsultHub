import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const defaultDoctor = {
  doctorId: "",
  name: "",
  email: "",
  phone: "",
  photo: "",
  education: "",
  experience: "",
  speciality: "",
  appointmentFee: "",
  availability: "",
  about: "",
  address: "",
  dailySlots: [],
};

const initialState = {
  doctors: [],
  currentDoctor: (() => {
    try {
      const stored = localStorage.getItem("currentDoctor");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  })(),
  selectedDoctor: (() => {
    try {
      const stored = localStorage.getItem("selectedDoctor");
      return stored ? JSON.parse(stored) : defaultDoctor;
    } catch (error) {
      return defaultDoctor;
    }
  })(),
  status: "idle",
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API}/doctors`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors"
      );
    }
  }
);

export const addDoctorAndGetUpdatedList = createAsyncThunk(
  "doctors/addDoctorAndGetUpdatedList",
  async (doctorData, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/doctors`,
        doctorData
      );
      const newDoctor = response.data.data;

      // Dispatch the addDoctor action to update the Redux state
      dispatch(addDoctor(newDoctor));

      // Get the updated doctors list
      const state = getState();
      const updatedDoctors = state.doctors.doctors;

      console.log("Updated doctors list:", updatedDoctors);

      // Return the updated list
      return updatedDoctors;
    } catch (error) {
      console.error("Failed to add doctor:", error.message);
      throw error;
    }
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    addSelectedDoctor: (state, action) => {
      state.selectedDoctor = { ...action.payload };
      localStorage.setItem("selectedDoctor", JSON.stringify(action.payload));
    },

    addCurrentDoctor: (state, action) => {
      state.currentDoctor = { ...action.payload };
      localStorage.setItem("currentDoctor", JSON.stringify(action.payload));
    },
    addDoctor: (state, action) => {
      state.doctors.push(action.payload);
      console.log("Successfully added doctor to Redux:", state.doctors);
    },
    removeDoctor: (state, action) => {
      state.doctors = state.doctors.filter(
        (doctor) => doctor.doctorId !== action.payload
      );
    },
    updateDoctor: (state, action) => {
      const { doctorId, updateDetails } = action.payload;
      const index = state.doctors.findIndex(
        (doctor) => doctor.doctorId === doctorId
      );
      if (index !== -1) {
        state.doctors[index] = { ...state.doctors[index], ...updateDetails };
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Handlers for fetchDoctors
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handlers for addDoctorAndGetUpdatedList
      .addCase(addDoctorAndGetUpdatedList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addDoctorAndGetUpdatedList.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Async thunk completed successfully:", action.payload);
      })
      .addCase(addDoctorAndGetUpdatedList.rejected, (state, action) => {
        state.status = "Failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addDoctor,
  removeDoctor,
  updateDoctor,
  addCurrentDoctor,
  addSelectedDoctor,
} = doctorSlice.actions;
export default doctorSlice.reducer;
