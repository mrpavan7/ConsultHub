import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl px-4 pt-5 mx-auto">
      <div className="mt-8 mb-4 text-center">
        <h1 className="text-4xl font-bold text-[#004A76]">
          Terms and Conditions
        </h1>
      </div>

      <div className="px-16 py-5 space-y-6 bg-[#529CC7] rounded-t-3xl">
        <h2 className="text-xl font-bold text-[#004A76]">1. Introduction</h2>
        <p className="text-gray-700">
          By using ConsultHub to book appointments with healthcare providers,
          you agree to the following terms and conditions. If you do not agree
          with these terms, you must not use this platform.
        </p>

        <h2 className="text-xl font-bold text-[#004A76]">2. Eligibility</h2>
        <p className="text-gray-700">
          To use ConsultHub, you must be at least 18 years old or have parental
          consent to use the service.
        </p>

        <h2 className="text-xl font-bold text-[#004A76]">
          3. Account and Registration
        </h2>
        <p className="text-gray-700">
          Users must provide accurate, current, and complete information during
          the registration process. It is the responsibility of users to keep
          their login credentials confidential.
        </p>

        <h2 className="text-xl font-bold text-[#004A76]">
          4. Appointment Booking
        </h2>
        <ul className="pl-6 space-y-2 text-gray-700 list-disc">
          <li>
            <strong>Appointment Scheduling:</strong> ConsultHub allows users to
            book appointments with doctors based on availability. Users must
            select a valid date and time when booking.
          </li>
          <li>
            <strong>Cancellations:</strong> Users can cancel appointments
            according to the cancellation policy specified by the doctor or
            ConsultHub. Failure to cancel within the specified time may result
            in a cancellation fee.
          </li>
          <li>
            <strong>Availability:</strong> Availability of doctors is subject to
            change, and ConsultHub cannot guarantee appointments at all times.
          </li>
          <li>
            <strong>Appointment Fee:</strong> Users must pay the appointment fee
            as specified by the doctor. The payment must be completed through
            the payment gateway before the appointment is confirmed unless
            otherwise stated.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[#004A76]">5. Payment</h2>
        <ul className="pl-6 space-y-2 text-gray-700 list-disc">
          <li>
            <strong>Payment Methods:</strong> Payment for appointments can be
            made through various payment methods available on ConsultHub.
          </li>
          <li>
            <strong>Payment Failure:</strong> If the payment fails, the
            appointment will not be confirmed, and users will be notified.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[#004A76]">
          6. Confidentiality and Privacy
        </h2>
        <p className="text-gray-700">
          All personal information provided by users is subject to our Privacy
          Policy. ConsultHub will use this information to process appointment
          bookings and communicate relevant details.
        </p>
        <p className="text-gray-700">
          Medical information shared with doctors is considered confidential and
          will only be used to facilitate the appointment.
        </p>

        <h2 className="text-xl font-bold text-[#004A76]">
          7. User Responsibilities
        </h2>
        <ul className="pl-6 space-y-2 text-gray-700 list-disc">
          <li>
            Users are responsible for providing accurate information regarding
            their health conditions, symptoms, and medical history.
          </li>
          <li>
            It is the user’s responsibility to ensure that they are booking with
            the correct doctor and that the appointment time works for their
            schedule.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[#004A76]">
          8. Doctor’s Responsibilities
        </h2>
        <ul className="pl-6 space-y-2 text-gray-700 list-disc">
          <li>
            Doctors are responsible for providing accurate medical advice and
            conducting consultations in a professional manner.
          </li>
          <li>
            ConsultHub does not guarantee any outcomes from consultations, and
            doctors are independent professionals responsible for the treatment
            they provide.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[#004A76]">9. Liabilities</h2>
        <ul className="pl-6 space-y-2 text-gray-700 list-disc">
          <li>
            ConsultHub is not liable for any medical outcomes, errors, or
            misdiagnosis resulting from the use of the platform or consultations
            with doctors.
          </li>
          <li>
            ConsultHub is not liable for any system downtime or interruptions in
            service.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[#004A76]">
          10. Limitation of Liability
        </h2>
        <p className="text-gray-700">
          In no event shall ConsultHub, its directors, employees, or affiliates
          be liable for any indirect, incidental, special, or consequential
          damages, or for any loss of data or profits, arising out of the use or
          inability to use the platform.
        </p>

        <h2 className="text-xl font-bold text-[#004A76]">
          11. Prohibited Activities
        </h2>
        <ul className="pl-6 space-y-2 text-gray-700 list-disc">
          <li>Use the platform for any illegal or unauthorized purpose.</li>
          <li>Disrupt or interfere with the functionality of the platform.</li>
          <li>
            Provide false or misleading information during the registration or
            appointment process.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-[#004A76]">
          12. Changes to Terms and Conditions
        </h2>
        <p className="text-gray-700">
          ConsultHub reserves the right to update these terms and conditions at
          any time. Users will be notified of any significant changes.
        </p>

        <h2 className="text-xl font-bold text-[#004A76]">13. Governing Law</h2>
        <p className="text-gray-700">
          These terms and conditions are governed by the laws of [Your
          Country/State].
        </p>

        <h2 className="text-xl font-bold text-[#004A76]">
          14. Contact Information
        </h2>
        <p className="text-gray-700">
          If you have any questions or concerns about these terms, please
          contact us at [contact information].
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
