import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Schema Definition
const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Doctor", "Patient", "Guest"],
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
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
    address: { type: String },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    DOB: {
      type: Date,
      validate: {
        validator: function (v) {
          return v < new Date(); // Ensure DOB is in the past
        },
        message: "Date of Birth must be in the past!",
      },
    },
    speciality: { type: String },
    experience: {
      type: Number,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Experience must be an integer value!",
      },
    },
    photo: { type: String },
    education: { type: String },
    appointmentFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    about: { type: String, maxlength: 500 },
    totalAppointments: { type: Number, default: 0 },
    AppointmentFulfilled: { type: Number, default: 0 },
    AppointmentCanceled: { type: Number, default: 0 },
    AppointmentPending: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    satisfactionScore: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Pre-save Hook to Hash Password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to Compare Passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate Satisfaction Score (Virtual Field)
UserSchema.virtual("satisfactionPercentage").get(function () {
  return this.satisfactionScore * 20; // Convert score (0-5) to percentage (0-100)
});

// Export the Model
const User = mongoose.model("User", UserSchema);

export default User;
