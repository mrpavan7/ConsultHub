import Doctor from "../models/doctors.model.js";

//to get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error in fetching doctors:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//to add a new doctor
export const createDoctor = async (req, res) => {
  const doctor = req.body;

  if (!doctor.doctorId || !doctor.name || !doctor.email || !doctor.education) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all required details" });
  }

  try {
    const existingDoctor = await Doctor.findOne({ doctorId: doctor.doctorId });

    if (existingDoctor) {
      return res
        .status(409)
        .json({ success: false, message: "Doctor already exists" });
    }

    const newDoctor = new Doctor(doctor);
    await newDoctor.save();
    res.status(201).json({ success: true, data: newDoctor });
  } catch (error) {
    console.error("Error creating new doctor:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//to remove a doctor
export const removeDoctor = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "DoctorId is required" });
  }

  try {
    const deletedDoctor = await Doctor.findOneAndDelete({ doctorId: id });

    if (!deletedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully removed doctor",
      data: deletedDoctor,
    });
  } catch (error) {
    console.error("Error removing doctor:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//to update doctor
export const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const updateDetails = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "DoctorId is required" });
  }

  if (!updateDetails.address) {
    return res
      .status(400)
      .json({ success: false, message: "Address is required" });
  }

  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { doctorId: id },
      updateDetails,
      { new: true }
    );

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Successfully updated doctor",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const fetchDoctorByDoctorId = async (req, res) => {
  const { doctorId } = req.query;

  if (!doctorId) {
    return res
      .status(400)
      .json({ success: "false", message: "Please provide DoctorId." });
  }

  try {
    const doctor = await Doctor.find({ doctorId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: "false", message: "Doctor not found." });
    }

    return res.status(200).json({
      success: "true",
      message: "Doctor fetched successfully.",
      doctor: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: "false",
      message: "Internal server error.",
      error: error.message,
    });
  }
};
