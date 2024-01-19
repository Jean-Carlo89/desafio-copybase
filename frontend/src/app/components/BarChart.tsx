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

type BarChartProps = {
  data: ChartData<'bar', number[], string>;

  options: any;
};

export const BarChart = ({ data, options }: BarChartProps) => {
  const fake_data = {
    labels: ['Mon', 'tue'],
    datasets: [
      { label: 'branch', data: [100, 200, 300], backgroundColor: '#61DBFB' },
    ],
  };

  console.log(data);

  return (
    <div>
      <Bar
        data={data}
        options={options}
        height="650px"
        title="Chart.js Line Chart"
      ></Bar>
    </div>
  );
};
