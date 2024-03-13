"use client";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
   scales,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import Header from "../../_components/header";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

type Props = {
   positionName: string;
   labels: string[];
   dataSet: number[];
};

const BarGraphContainer = ({ positionName, labels, dataSet }: Props) => {
   const options = {
      indexAxis: "y" as const,
      elements: {
         bar: {
            borderWidth: 2,
         },
      },
      responsive: true,
      plugins: {
         legend: {
            position: "right" as const,
            
         },
      },
      scales: {
         x: {
            ticks: {
               font: {
                  size: 16,
               },
            },
         },
         y: {
            ticks: {
               font: {
                  size: 16,
               },
            },
         },
      },
   };

   const data = {
      labels,
      datasets: [
         {
            label: "Total Votes",
            data: dataSet,
            borderColor: "rgb(21, 128, 61)",
            backgroundColor: "rgb(34, 197, 94)",
         },
      ],
   };
   return (
      <div className="w-full">
         <div className="text-center">
            <Header text={positionName}></Header>
         </div>
         <Bar options={options} data={data} />
      </div>
   );
};

export default BarGraphContainer;
