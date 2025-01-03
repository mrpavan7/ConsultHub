import React, { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import { useSelector } from "react-redux";
import axios from "axios";

const AllPatients = () => {
  const user = useSelector((state) => state.auth.user);
  const [reviews, setReviews] = useState(null);

  const fetchReviews = async (user) => {
    try {
      if (!user.uid) return;
      const params = { doctorId: user.uid };
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/reviews/fetch-reviews",
        { params }
      );
      setReviews(response?.data?.reviews);
    } catch (error) {
      console.error("Failed to fetch Reviews", error.message);
    }
  };

  useEffect(() => {
    if (user && reviews === null) {
      fetchReviews(user);
    }
  }, [user]);

  return (
    <div className="h-auto">
      <div className="bg-[#0075BC] mt-0 relative right-10 p-5 rounded-r-full pl-24 pr-10 w-fit">
        <h1 className="text-4xl font-bold text-white ">All Patients</h1>
      </div>
      {reviews === null ? (
        <div className="mt-16 text-center text-white col-span-full">
          <h2 className="text-3xl font-semibold">No Patients Found...!</h2>
          <p className="mt-2 text-lg text-white">
            You haven’t treated any patients yet. Once patients leave their
            reviews, they will appear here.
          </p>
        </div>
      ) : null}
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-6 place-items-center h-auto min-h-[75vh] px-10 mt-16">
        {reviews && reviews.length > 0
          ? reviews.map((review, index) => {
              return (
                <PatientCard
                  key={index}
                  patientId={review.patientId}
                  rating={review.rating}
                  feedback={review.feedback}
                />
              );
            })
          : null}
      </div>
    </div>
  );
};

export default AllPatients;
