import express from "express";
import {
  createUser,
  deleteUser,
  fetchTopDoctors,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/top-doctors", fetchTopDoctors);
router.get("/:uid", getUser);
router.post("/", createUser);
router.delete("/:uid", deleteUser);
router.put("/:uid", updateUser);

export default router;
