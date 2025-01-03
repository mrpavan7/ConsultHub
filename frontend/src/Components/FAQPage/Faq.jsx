import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
// import { ReactComponent as FaqBlob } from "../../svg/FaqBlob.svg";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How do I schedule an appointment with a doctor?",
      answer:
        "You can schedule an appointment by browsing our list of doctors, selecting your preferred doctor, and clicking the 'Book Appointment' button. Choose your preferred date and time from available slots, fill in your medical concern details, and confirm your booking. You'll receive a confirmation notification once the appointment is scheduled.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We currently offer two payment options: 'Pay Now' for immediate online payment and 'Pay Later' which allows you to pay at the time of consultation. For online payments, we accept major credit/debit cards and digital payment methods.",
    },
    {
      question: "How can I cancel or reschedule my appointment?",
      answer:
        "You can manage your appointments through the 'My Appointments' section. To cancel, click the 'Cancel' button on your appointment card. For rescheduling, you'll need to cancel the current appointment and book a new one. Please note that cancellations should be made at least 24 hours before the scheduled time.",
    },
    {
      question: "Are online consultations available?",
      answer:
        "In future Yes, we offer online consultations through our platform. When booking an appointment, you can choose between in-person or online consultation options. For online consultations, you'll receive a secure link to connect with your doctor at the scheduled time.",
    },
    {
      question: "How do I access my medical records?",
      answer:
        "Your medical records and consultation history are available in your profile section. This includes past appointments, prescriptions, and doctor's notes. All information is kept secure and confidential, accessible only to you and your consulting doctors.",
    },
    {
      question: "What should I do in case of an emergency?",
      answer:
        "Our platform is not designed for emergency medical situations. If you're experiencing a medical emergency, please call your local emergency services immediately or visit the nearest emergency room. For urgent but non-emergency cases, some doctors offer priority consultation slots.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-12 text-5xl font-semibold text-center text-[#0075BC] font-outfit">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden bg-white rounded-lg shadow-md"
            >
              <button
                className="flex items-center justify-between w-full p-4 text-left bg-[#B3E5F6] hover:bg-[#93d5ee] transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-medium text-[#004A76] font-outfit">
                  {faq.question}
                </span>
                <IoIosArrowDown
                  className={`w-6 h-6 text-[#0075BC] transform transition-transform duration-200 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeIndex === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="p-4 text-base text-gray-600 bg-white font-outfit">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 font-outfit">
            Still have questions?
            <a
              href="/contact"
              className="ml-2 text-[#0075BC] hover:underline font-medium"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
