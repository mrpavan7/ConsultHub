import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

export const sendAppointmentEmails = async (appointmentDetails) => {
  const {
    doctorEmail,
    doctorName,
    patientEmail,
    patientName,
    appointmentDate,
    appointmentTime,
    problem,
  } = appointmentDetails;

  const commonStyles = `
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
    }
    .header {
      background-color: #2c5282;
      padding: 20px;
      text-align: center;
    }
    .header h2 {
      color: white;
      margin: 0;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .appointment-details {
      background-color: #f8f9fa;
      border-left: 4px solid #2c5282;
      padding: 15px;
      margin: 15px 0;
    }
    .appointment-details li {
      list-style: none;
      margin: 10px 0;
    }
    .button {
      background-color: #2c5282;
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin: 15px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
  </style>
`;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    return new Date(`2000/01/01 ${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Email to Doctor
  const doctorMailOptions = {
    from: process.env.EMAIL_USER,
    to: doctorEmail,
    subject: "New Appointment Notification",
    html: `
      ${commonStyles}
      <div class="email-container">
        <div class="header">
          <h2>New Appointment Alert</h2>
        </div>
        <div class="content">
          <p>Dear ${doctorName},</p>
          <p>You have a new appointment scheduled with the following details:</p>
          <div class="appointment-details">
            <ul>
              <li>🏥 <strong>Patient:</strong> ${patientName}</li>
              <li>📅 <strong>Date:</strong> ${formatDate(appointmentDate)}</li>
              <li>⏰ <strong>Time:</strong> ${formatTime(appointmentTime)}</li>
              <li>📋 <strong>Problem:</strong> ${problem}</li>
            </ul>
          </div>
          <a href="#" class="button">View in Dashboard</a>
        </div>
        <div class="footer">
          <p>ConsultHub Medical Services</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    `,
  };

  // Email to Patient
  const patientMailOptions = {
    from: process.env.EMAIL_USER,
    to: patientEmail,
    subject: "Appointment Confirmation",
    html: `
      ${commonStyles}
      <div class="email-container">
        <div class="header">
          <h2>Appointment Confirmed</h2>
        </div>
        <div class="content">
          <p>Dear ${patientName},</p>
          <p>Your appointment has been successfully scheduled with ${doctorName}.</p>
          <div class="appointment-details">
            <ul>
              <li>📅 <strong>Date:</strong>${formatDate(appointmentDate)}</li>
              <li>⏰ <strong>Time:</strong>${formatTime(appointmentTime)}</li>
              <li>📋 <strong>Problem:</strong> ${problem}</li>
            </ul>
          </div>
          <p><strong>Important:</strong> Please arrive 10 minutes before your scheduled appointment time.</p>
          <a href="#" class="button">Manage Appointment</a>
        </div>
        <div class="footer">
          <p>ConsultHub Medical Services</p>
          <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          <p>For urgent matters, please call our helpline: 1234567890</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(doctorMailOptions);
    await transporter.sendMail(patientMailOptions);
    return true;
  } catch (error) {
    console.error("Error sending emails:", error);
    return false;
  }
};
