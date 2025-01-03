import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    doctorId: {
      type: String,
      unique: true,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    appointmentStatus: {
      type: String,
      enum: ["Pending", "Scheduled", "Completed", "Canceled"],
      default: "pending",
    },
    appointmentType: {
      type: String,
      enum: ["in-person", "virtual"],
      default: "in-person",
    },
    appointmentFee: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    problem: {
      type: String,
      default: "",
    },
    speciality: {
      type: String,
      default: "",
    },
    prescription: {
      type: String,
      default: "",
    },
    review: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true, //stores createdAt ,updatedAt values
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
