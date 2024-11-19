import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientSchema", //reference to patients collection
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorSchema", //reference to doctors collections
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentStatus: {
      type: String,
      enum: ["pending", "scheduled", "completed", "canceled"],
      default: "pending",
    },
    appointmentType: {
      type: String,
      enum: ["in-person", "virtual"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, //stores createdAt ,updatedAt values
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
