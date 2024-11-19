import Appointment from "../models/appointments.model.js";
import mongoose from "mongoose";

//to get all the Appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error in fetching products :", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//to create an Appointment
export const createAppointment = async (req, res) => {
  const appointment = req.body;

  if (
    !appointment.patientId ||
    !appointment.doctorId ||
    !appointment.appointmentDate ||
    !appointment.appointmentStatus ||
    !appointment.appointmentType
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newAppointment = new Appointment(appointment);

  try {
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    console.error("Error creating new appointment :", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//to update an Appointment
export const updateAppointment = async (req, res) => {
  const { id } = req.params;

  const appointment = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      appointment,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error("Error Updating Appointment:", Error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//to delete an Appointment
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
  }

  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Error Deleting The Appointment:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
