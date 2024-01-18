'use client';
import React from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
// const data_test = [
//   { year: 2010, count: 10 },
//   { year: 2011, count: 20 },
//   { year: 2012, count: 15 },
//   { year: 2013, count: 25 },
//   { year: 2014, count: 22 },
//   { year: 2015, count: 30 },
//   { year: 2016, count: 28 },
// ];

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// export default function BarChart() {
//   return <Bar data={data_test} options={}></Bar>;
// }

export const BarChart = () => {
  const data = {
    labels: ['Mon', 'tue'],
    datasets: [
      { label: 'branch', data: [100, 200, 300], backgroundColor: '#61DBFB' },
    ],
  };

  const options = {};
  return (
    <div>
      <Bar data={data} options={options}></Bar>
    </div>
  );
};
