import express from "express";
import {
  createDoctor,
  fetchDoctorByDoctorId,
  getDoctors,
  removeDoctor,
  updateDoctor,
} from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/", getDoctors);
router.post("/", createDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", removeDoctor);
router.get("/fetch-doctor", fetchDoctorByDoctorId);

export default router;
