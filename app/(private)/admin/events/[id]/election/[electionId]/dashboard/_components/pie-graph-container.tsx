import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Header from "../../_components/header";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
   positionName: string;
   labels: string[];
   dataSet: number[];
};

export function PieGraphContainer({ positionName, labels, dataSet }: Props) {
   const options = {
      plugins: {
         legend: {
            position: "right" as const,
            labels: {
               font: {
                  size:window.innerWidth > 390 ? 20 : 16
               },
            },
         },
         
      },
      legend:{
         labels: {
            font: 30,
         },
      }
   };
   const data = {
      labels,
      datasets: [
         {
            label: "Total Votes",
            data: dataSet,
            backgroundColor: [
               "rgb(124,232,247)",
               "rgb(255,250,106)",
               "rgb(255,168,168)",
               "rgb(202,144,184)",
               "rgb(103,243,204)",
               "rgb(68,210,201)",
               "rgb(17,85,212)",
            ],
            borderColor: [
               "rgb(124,232,247)",
               "rgb(255,250,106)",
               "rgb(255,168,168)",
               "rgb(202,144,184)",
               "rgb(103,243,204)",
               "rgb(68,210,201)",
               "rgb(17,85,212)",
            ],
         },
      ],
   };

   return (
      <div className="w-full flex justify-center flex-col">
         <div className="text-center">
            <Header text={positionName}></Header>
         </div>
         <div className="flex justify-center h-full">
            <Pie options={options} data={data} />
         </div>
      </div>
   );
}
