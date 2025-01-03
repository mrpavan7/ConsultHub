import React from "react";
import classes from "./Dashboard.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Tooltip as ReactTooltip } from "react-tooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatsCard = ({
  totalAppointments,
  appointmentsCanceled,
  appointmentsCompleted,
  totalRevenue,
  patientSatisfaction,
  chartData,
}) => {
  const data = {
    labels: ["week1", "week2", "week3", "week4", "week5"],
    datasets: [
      {
        label: "Appointments",
        data: chartData ? chartData : [0, 0, 0, 0, 0],
        borderColor: "#0075BC",
        backgroundColor: "#0075BC",
        pointBorderColor: "#3F3D56",
        pointBackgroundColor: "#3F3D56",
        pointHoverRadius: 6,
        pointRadius: 5,
        pointStyle: "circle",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.7))",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderWidth: 0,
        borderColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
          display: false,
        },
        ticks: {
          color: "#666",
          beginAtZero: false,
        },
      },
    },
  };

  const percentage = patientSatisfaction?.toFixed(0);

  return (
    <div className="z-10 w-full h-[70%] bg-[#65AED8] rounded-xl">
      <div className="w-full h-[50%] border-[3px] rounded-t-xl p-1 bg-[#B3E5F6] bg-opacity-50 border-[#0075BC]">
        <Line data={data} options={options} />
      </div>
      <div className="h-[50%] w-full border-[3px] border-[#0075BC] bg-[#B3E5F6] bg-opacity-50 border-t-0 py-4 px-5 justify-evenly  rounded-b-xl flex flex-col">
        <div className="flex w-full gap-2">
          <p className="flex justify-between w-[65%] text-lg text-[#0075BC] font-outfit font-semibold">
            Total Appointments <span>:</span>
          </p>
          <p className="text-lg font-semibold font-outfit text-[#4B5563]">
            {totalAppointments ? totalAppointments : 0}
          </p>
        </div>
        <div className="flex w-full gap-2">
          <p className="flex justify-between w-[65%] text-lg text-[#0075BC] font-outfit font-semibold">
            Appointments Completed <span>:</span>
          </p>
          <p className="text-lg font-semibold font-outfit text-[#4B5563]">
            {appointmentsCompleted ? appointmentsCompleted : 0}
          </p>
        </div>
        <div className="flex w-full gap-2">
          <p className="flex justify-between w-[65%] text-lg text-[#0075BC] font-outfit font-semibold">
            Appointments Canceled <span>:</span>
          </p>
          <p className="text-lg font-semibold font-outfit text-[#4B5563]">
            {appointmentsCanceled ? appointmentsCanceled : 0}
          </p>
        </div>
        <div className="flex items-center w-full gap-2">
          <p className="flex justify-between w-[65%] text-lg text-[#0075BC] font-outfit font-semibold">
            Patient Satisfaction Score <span>:</span>
          </p>
          <div
            className={`${classes.satisfaction} h-[12px] w-[35%] bg-white rounded-full`}
          >
            <div
              className="h-full bg-[#0075BC] rounded-full"
              data-tooltip-content={`${percentage}%`}
              data-tooltip-id="my-tooltip"
              style={{
                width: `${patientSatisfaction ? patientSatisfaction : 0}%`,
              }}
            >
              <ReactTooltip id="my-tooltip" />
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <p className="flex justify-between w-[65%] text-lg text-[#0075BC] font-outfit font-semibold">
            Total Revenue Earned <span>:</span>
          </p>
          <p className="text-lg font-semibold font-outfit text-[#4B5563]">
            {`$ ${totalRevenue ? totalRevenue : "0"}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
