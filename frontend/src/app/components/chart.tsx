'use client';
import React from 'react';
import Chart from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// export default function BarChart() {
//   return <Bar data={data_test} options={}></Bar>;
// }

type BarChartProps = {
  data: ChartData<'bar', number[], string>;
};

export const BarChart = ({ data }: BarChartProps) => {
  const fake_data = {
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
