import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
  fetchAvailableSlots,
  fetchAppointments,
  fetchDoctorStats,
  fetchChartData,
  fetchFirstAvailableSlotAfterWeek,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.get("/fetch-appointments", fetchAppointments);
router.get("/available-slots", fetchAvailableSlots);
router.get("/stats", fetchDoctorStats);
router.get("/chart-data", fetchChartData);
router.get("/first-available-slot", fetchFirstAvailableSlotAfterWeek);

export default router;
