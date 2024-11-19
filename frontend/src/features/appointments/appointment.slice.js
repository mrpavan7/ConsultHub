import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  appointment: [
    {
      patientId: undefined,
      doctorId: undefined,
      doctorName: "",
      patientName: "",
      appointmentTime: "",
      appointmentType: "",
      appointmentStatus: "",
      notes: {
        topic: "",
        time: "",
        explanation: "",
      },
      paymentStatus: "",
    },
  ],
};
