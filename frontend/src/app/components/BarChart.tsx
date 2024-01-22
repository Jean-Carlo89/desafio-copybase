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
import { months_array } from '@/helpers/months_array';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type BarChartProps = {
  //data: ChartData<'bar', number[], string>;
  selectedYears: never[];
  metric_array: [
    {
      year: string;
      months: {
        [key: string]: number;
      };
    },
  ];

  options: any;
};

export const BarChart = ({
  options,
  metric_array,
  selectedYears,
}: BarChartProps) => {
  const MonthNames = months_array;
  const months = MonthNames.map((name, index) => {
    const monthNumber = (index + 1).toString().padStart(2, '0');
    return { number: monthNumber, name: name };
  });

  console.log({ metric_array });
  console.log(metric_array);
  const dataset = metric_array
    .filter((yearData) => selectedYears.includes(parseInt(yearData.year)))
    .map((yearData) => {
      const monthlyData = months.map(
        (month) => yearData.months[month.number] || 0,
      );
      return {
        label: yearData.year,
        data: monthlyData,
        backgroundColor: generateRandomColor(),
      };
    });

  console.log({ dataset });

  const data = {
    labels: months.map((month) => month.name),
    datasets: dataset,
  };

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

function generateRandomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
}
