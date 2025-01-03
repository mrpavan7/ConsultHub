import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial State
const initialUserState = {
  uid: "",
  role: "Guest",
  name: "",
  email: "",
  password: "",
  photo: "",
  phone: "",
  address: "",
  gender: "Other",
  DOB: null,
  speciality: "",
  experience: 0,
  education: "",
  appointmentFee: 0,
  about: "",
  totalAppointments: 0,
  appointmentFulfilled: 0,
  appointmentCanceled: 0,
  appointmentPending: 0,
  totalRevenue: 0,
  satisfactionScore: 0,
};

const initialState = {
  isLoggedIn: false,
  popupVisibility: false,
  user: { ...initialUserState },
  loading: false,
  error: null,
};

// Fetch user by Firebase UID
export const fetchUserByUID = createAsyncThunk(
  "auth/fetchUserByUID",
  async (uid, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API}/users/${uid}`
      );
      return response.data.data; // Assumes the user data is in `data.data`
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openPopup: (state, action) => {
      state.popupVisibility = true;
    },
    closePopup: (state, action) => {
      state.popupVisibility = false;
    },
    // Login Reducer
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = { ...state.user, ...action.payload }; // Merge user data with defaults
    },
    // Logout Reducer
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = { ...initialUserState }; // Reset user to initial state
    },
    // Update User Info Reducer
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }; // Dynamically update user fields
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User By UID
      .addCase(fetchUserByUID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByUID.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.isLoggedIn = true; // Set user as logged in
        state.loading = false;
      })
      .addCase(fetchUserByUID.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// Export Actions and Reducer
export const { login, logout, updateUser, openPopup, closePopup } =
  authSlice.actions;
export default authSlice.reducer;
