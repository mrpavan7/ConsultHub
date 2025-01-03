import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v); // Validate phone number length
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    photo: {
      type: String,
      default: "",
    },
    education: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    speciality: {
      type: String,
      default: "General Physician",
    },
    appointmentFee: {
      type: Number,
      default: 50,
    },
    dailySlots: [String],
    availability: {
      type: Boolean,
      default: true,
    },
    about: {
      type: String,
      default: " ",
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5;
}

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
