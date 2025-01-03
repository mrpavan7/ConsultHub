import Appointment from "../models/appointments.model.js";
import Doctor from "../models/doctors.model.js";
import mongoose from "mongoose";
import moment from "moment";
import User from "../models/users.model.js";
import { sendAppointmentEmails } from "../config/emailService.js";

export const fetchAppointments = async (req, res) => {
  const { patientId, doctorId, appointmentDate } = req.query;

  if (!patientId?.trim() && !doctorId?.trim()) {
    return res.status(400).json({
      message: "Please provide either PatientId or DoctorId",
    });
  }

  try {
    const query = {};
    if (patientId?.trim()) query.patientId = patientId;
    if (doctorId?.trim()) query.doctorId = doctorId;

    if (appointmentDate) {
      const parsedDate = new Date(appointmentDate);
      if (isNaN(parsedDate)) {
        return res
          .status(400)
          .json({ message: "Invalid appointmentDate format" });
      }
      query.appointmentDate = parsedDate;
    }

    // Get the current time in IST
    const currentTimeIST = new Date(
      new Date().getTime() + 5.5 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000
    );

    // Fetch all matching appointments
    const appointments = await Appointment.find(query);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found...!" });
    }

    // Process and update appointments
    const updatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const { appointmentDate, appointmentTime, appointmentStatus } =
          appointment;

        // Combine `appointmentDate` and `appointmentTime` into a UTC Date object
        const combinedDateTimeIST = new Date(
          `${
            appointmentDate.toISOString().split("T")[0]
          }T${appointmentTime}:00.000Z`
        );

        // Convert UTC to IST
        // const combinedDateTimeIST = new Date(
        //   combinedDateTimeUTC.getTime() + 5.5 * 60 * 60 * 1000
        // );

        if (
          appointmentStatus === "Scheduled" &&
          combinedDateTimeIST <= currentTimeIST
        ) {
          // Mark as completed if past the combined date and time in IST
          appointment.appointmentStatus = "Completed";
          appointment.paymentStatus = "Paid";
          await appointment.save(); // Update the database
        }

        return appointment;
      })
    );

    return res.status(200).json({
      message: "Successfully fetched and processed appointments in IST",
      appointments: updatedAppointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchChartData = async (req, res) => {
  const { doctorId } = req.query;
  try {
    if (!doctorId) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
    }

    // Get the start and end of the current month in UTC
    const now = moment().utc();
    const startOfMonth = now.startOf("month").startOf("day").toDate();
    const endOfMonth = now.endOf("month").endOf("day").toDate();

    // Fetch all appointments for the doctor within the current month
    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Initialize weekly data
    const weeks = Array(5).fill(0);

    // Categorize appointments into weeks
    appointments.forEach((appointment) => {
      const appointmentMoment = moment(appointment.appointmentDate).utc();
      const weekOfMonth = Math.floor(
        appointmentMoment.diff(startOfMonth, "days") / 7
      );

      if (weekOfMonth >= 0 && weekOfMonth < 5) {
        weeks[weekOfMonth] += 1;
      }
    });

    res.status(200).json({ success: true, weeks });
  } catch (error) {
    console.error("Detailed error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const fetchDoctorStats = async (req, res) => {
  const { doctorId } = req.query;
  const uid = doctorId;
  try {
    const appointments = await Appointment.find({ doctorId });
    const totalAppointments = appointments.length;
    const appointmentsCanceled = appointments.filter(
      (appointment) => appointment.appointmentStatus === "Canceled"
    ).length;
    const appointmentsCompleted = appointments.filter(
      (appointment) => appointment.appointmentStatus === "Completed"
    ).length;
    const totalRevenue = appointments
      .filter((appointment) => appointment.appointmentStatus === "Completed")
      .reduce((sum, app) => sum + app.appointmentFee, 0);

    const doctor = await User.findOne({ uid });
    const patientSatisfaction = doctor?.satisfactionScore || 0;

    await User.findOneAndUpdate(
      { uid },
      { totalAppointments: totalAppointments }
    );

    return res.status(200).json({
      totalAppointments,
      appointmentsCanceled,
      appointmentsCompleted,
      totalRevenue,
      patientSatisfaction,
    });
  } catch (error) {
    console.error("Error While Fetching Doctor Stats", error.message);
    return res
      .status(500)
      .json({ error: error.message, message: "Internal Server Error" });
  }
};

//to get all the Appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error in fetching Appointments :", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//to create an Appointment
export const createAppointment = async (req, res) => {
  const appointment = req.body;
  const doctorId = appointment.doctorId;
  const appointmentTime = appointment.appointmentTime;
  const appointmentDate = appointment.appointmentDate;

  console.log("The req.body :", appointment);
  if (
    !appointment.patientId ||
    !appointment.doctorId ||
    !appointment.appointmentDate ||
    !appointment.appointmentTime
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  try {
    const doctor = await Doctor.findOne({ doctorId: appointment.doctorId });
    const patient = await User.findOne({ uid: appointment.patientId });

    if (!doctor || !patient) {
      return res.status(404).json({
        success: false,
        message: "Doctor or patient not found",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      appointmentStatus: "Scheduled",
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "Slot already booked. Please choose another." });
    }

    const newAppointment = new Appointment({
      ...appointment,
      appointmentStatus: "Scheduled",
    });

    await newAppointment.save();
    const emailDetails = {
      doctorEmail: doctor.email,
      doctorName: doctor.name,
      patientEmail: patient.email,
      patientName: patient.name,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      problem: appointment.problem || "Not specified",
    };

    await sendAppointmentEmails(emailDetails);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully and notifications sent",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating new appointment :", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//to fetch the available slots for a doctor on a particular date
export const fetchAvailableSlots = async (req, res) => {
  const { doctorId, appointmentDate } = req.query;

  if (!doctorId || !appointmentDate) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide doctorId and date" });
  }

  try {
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const dailySlots = doctor.dailySlots;

    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentStatus: "Scheduled",
    });

    const bookedSlots = bookedAppointments.map(
      (appointment) => appointment.appointmentTime
    );
    const availableSlots = dailySlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.status(200).json({ success: true, slots: availableSlots });
  } catch (error) {
    console.error("Error Fetching Available Slots:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//to fetch the available slot after a week
export const fetchFirstAvailableSlotAfterWeek = async (req, res) => {
  const { doctorId, appointmentDate } = req.query;

  if (!doctorId || !appointmentDate) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide doctorId and date" });
  }

  try {
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const dailySlots = doctor.dailySlots;
    if (!dailySlots || dailySlots.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No slots defined for the doctor" });
    }

    const startDate = new Date(appointmentDate);
    startDate.setDate(startDate.getDate() + 7); // Start one week after the given date

    const findFirstAvailableSlot = async (currentDate) => {
      // Check for appointments on the current date
      const bookedAppointments = await Appointment.find({
        doctorId,
        appointmentDate: currentDate,
        appointmentStatus: "Scheduled",
      });

      const bookedSlots = bookedAppointments.map(
        (appointment) => appointment.appointmentTime
      );

      // Find available slots for the day
      const availableSlots = dailySlots.filter(
        (slot) => !bookedSlots.includes(slot)
      );

      // Return the first available slot if found
      if (availableSlots.length > 0) {
        return { date: currentDate, slot: availableSlots[0] };
      }

      // If no slots available, check the next day
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      return findFirstAvailableSlot(nextDate);
    };

    const firstAvailableSlot = await findFirstAvailableSlot(startDate);

    res.status(200).json({
      success: true,
      slot: firstAvailableSlot.slot,
      date: firstAvailableSlot.date.toISOString().split("T")[0], // Return date in YYYY-MM-DD format
    });
  } catch (error) {
    console.error("Error Fetching First Available Slot:", error.message);
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
      { new: true, runValidators: true, context: "query" }
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
