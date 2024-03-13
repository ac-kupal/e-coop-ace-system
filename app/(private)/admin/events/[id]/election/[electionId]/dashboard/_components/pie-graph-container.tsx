import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Header from '../../_components/header';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
   positionName: string;
   labels: string[];
   dataSet: number[];
};

export function PieGraphContainer({ positionName, labels, dataSet }: Props) {

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
            backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
               'rgba(153, 102, 255, 0.2)',
               'rgba(255, 159, 64, 0.2)',
             ],
             borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)',
             ],
         },
      ],
   };


  return (
   <div className="w-full">
   <div className="text-center">
      <Header text={positionName}></Header>
   </div>
   <Pie options={options} data={data} />
 </div>
  )

}
