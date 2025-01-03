import React, { useEffect, useState } from "react";
import classes from "./TopDoctors.module.css";
import TopCardLeft from "./TopCardLeft";
import TopCardRight from "./TopCardRight";
import axios from "axios";

const TopDoctors = () => {
  const [topDoctors, setTopDoctors] = useState([]);

  const fetchTopDoctors = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_API + "/users/top-doctors"
      );
      setTopDoctors(response.data.topDoctors);
    } catch (error) {
      console.error("Failed to fetch top doctors.", error.message);
    }
  };

  useEffect(() => {
    fetchTopDoctors();
  }, []);

  return (
    <div className={`${classes.banner} flex flex-col items-center mt-10`}>
      <div
        className={`${classes.TopDoctorsText} flex flex-col text-center text-white font-medium`}
      >
        <h1 className="text-6xl font-outfit">Top Doctors to Book</h1>
        <p className="text-xl font-normal mt-7 font-outfit">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>
      <div className={`${classes.container} grid place-items-center`}>
        <div
          className={`${classes.BlobContainer} h-lvh justify-between flex  w-full row-start-1 row-end-2 col-start-1 col-end-2`}
        >
          <div
            className={`${classes.halfCircle1} h-full aspect-square rounded-full`}
          ></div>
          <div className="overflow-x-hidden transform translate-y-[-10%] translate-x-[4%]">
            <div
              className={`${classes.halfCircle2} h-full aspect-square rounded-full`}
            ></div>
          </div>
        </div>
        <div
          className={`${classes.cardsContainer} z-10 flex flex-col  w-full row-start-1 row-end-2 col-start-1 col-end-2 `}
        >
          <div className={`${classes.cards} flex flex-row`}>
            <TopCardLeft
              pic={topDoctors[0]?.photo}
              name={topDoctors[0]?.name}
              speciality={topDoctors[0]?.speciality}
              doctor={topDoctors[0]}
              doctorId={topDoctors[0]?.uid}
            />
            <TopCardRight
              pic={topDoctors[1]?.photo}
              name={topDoctors[1]?.name}
              speciality={topDoctors[1]?.speciality}
              doctor={topDoctors[1]}
              doctorId={topDoctors[1]?.uid}
            />
          </div>
          <div className={`${classes.cards} flex flex-row`}>
            <TopCardLeft
              pic={topDoctors[2]?.photo}
              name={topDoctors[2]?.name}
              speciality={topDoctors[2]?.speciality}
              doctor={topDoctors[2]}
              doctorId={topDoctors[2]?.uid}
            />
            <TopCardRight
              pic={topDoctors[3]?.photo}
              name={topDoctors[3]?.name}
              speciality={topDoctors[3]?.speciality}
              doctor={topDoctors[3]}
              doctorId={topDoctors[3]?.uid}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;
