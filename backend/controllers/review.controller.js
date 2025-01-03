import Appointment from "../models/appointments.model.js";
import Doctor from "../models/doctors.model.js";
import Review from "../models/reviews.model.js";
import User from "../models/users.model.js";

export const calculateSatisfactionScore = async (doctorId) => {
  try {
    const reviews = await Review.find({ doctorId });
    if (!reviews || reviews.length === 0) return 0;

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length) * 20;

    // Update doctor's satisfaction score
    await User.findOneAndUpdate(
      { uid: doctorId },
      { satisfactionScore: averageRating }
    );

    return averageRating;
  } catch (error) {
    console.error("Error calculating satisfaction score:", error.message);
    return 0;
  }
};

export const createReview = async (req, res) => {
  const review = req.body;
  const appointmentId = review.appointmentId;
  const patientId = review.patientId;
  const doctorId = review.doctorId;

  if (!appointmentId || !patientId || !doctorId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  try {
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    const newReview = new Review(review);
    await newReview.save();
    await Appointment.findByIdAndUpdate(appointmentId, { review: true });
    const satisfactionScore = await calculateSatisfactionScore(doctorId);

    return res.status(201).json({
      success: true,
      message: "Successfully sent review.",
      review: newReview,
      satisfactionScore,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const fetchReviews = async (req, res) => {
  const { doctorId } = req.query;

  if (!doctorId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide doctorId." });
  }

  try {
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    const reviews = await Review.find({ doctorId });
    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No reviews found." });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched reviews.",
      reviews: reviews,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
