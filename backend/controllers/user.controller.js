import User from "../models/users.model.js";

import { format } from "date-fns";

export const getUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const formattedUser = {
      ...user.toObject(),
      DOB: user.DOB ? format(new Date(user.DOB), "d MMMM, yyyy") : null,
    };

    res.status(200).json({
      success: true,
      data: formattedUser,
      message: "User fetched successfully",
    });
  } catch (error) {
    console.error("Error while fetching user:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createUser = async (req, res) => {
  const user = req.body;

  if (!user.uid || !user.role || !user.name || !user.email || !user.password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide Required Details" });
  }

  const newUser = new User(user);

  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      data: newUser,
      message: "user created successfully",
    });
  } catch (error) {
    console.error("error while creating user", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { uid } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ uid }, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully.",
    });
  } catch (error) {
    console.error("Error while updating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = User.findOneAndDelete({ uid });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error while deleting user", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const fetchTopDoctors = async (req, res) => {
  try {
    const role = "Doctor";
    const doctors = await User.find({ role: "Doctor" });

    if (!doctors || doctors.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Doctors Found." });
    }
    const topDoctors = doctors
      .sort((a, b) => b.totalAppointments - a.totalAppointments)
      .slice(0, 4);

    return res.status(200).json({
      success: true,
      message: "Successfully Fetched Top Doctors.",
      topDoctors: topDoctors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};
