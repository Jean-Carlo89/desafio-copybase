'use client';

import Image from 'next/image';
import { BarChart } from './components/BarChart';
import React, { useEffect, useState } from 'react';
import { stringify } from 'querystring';
import { LineChart } from './components/LineChart';
import FileUpload from './components/FileUpload';

export default function Home() {
  const [mrr, setMrr] = useState<
    [{ year: string; months: { [key: string]: number } }]
  >([]);

  const [churnRate, setChurnRate] = useState<
    [{ year: string; months: { [key: string]: number } }]
  >([]);

  const [selectedYears, setSelectedYears] = useState([]);

  const [currentMetric, setCurrentMetric] = useState([]);

  const monthly_mmr = [
    {
      year: '2022',
      months: {
        '10': 6879.2125,
        '11': 14806.711666666666,
        '02': 28377.165833333336,
        '01': 34545.439999999995,
        '03': 17150.014166666668,
        '06': 19798.00833333334,
        '08': 12935.645833333334,
        '09': 14661.144999999999,
        '04': 21595.6775,
        '07': 12296.3925,
        '05': 15991.299166666666,
      },
    },
    {
      year: '2023',
      months: {
        '10': 3197.17,
        '11': 8027.233333333331,
        '12': 9385.48,
        '01': 22753.017500000005,
        '02': 4896.135,
        '03': 17239.838333333333,
        '06': 5492.438333333333,
        '08': 6686.113333333334,
        '09': 7191.044166666666,
        '05': 15626.894166666665,
        '07': 2689.3308333333334,
        '04': 8149.5391666666665,
      },
    },
  ];

  const fake_monthly_churn_rate = [
    {
      year: '2022',
      months: {
        '10': 6.046511627906977,
        '11': 6.164383561643835,
        '12': 3.9260969976905313,
        '06': 8.539944903581267,
        '03': 20.077220077220076,
        '01': 0,
        '05': 13.564668769716087,
        '04': 11.661807580174926,
        '07': 9.090909090909092,
        '02': 28.019323671497588,
        '09': 5.4892601431980905,
        '08': 6.746987951807229,
      },
    },
    {
      year: '2023',
      months: {
        '05': 1.530612244897959,
        '02': 0.9933774834437087,
        '08': 1.183431952662722,
        '04': 0.423728813559322,
        '01': 1.8970189701897018,
        '07': 0.5714285714285714,
        '06': 0.5076142131979695,
      },
    },
  ];

  useEffect(() => {
    setMrr(monthly_mmr);
    const returned_years = monthly_mmr.map((item) => {
      return item.year;
    });

    setChurnRate([]);

    setSelectedYears(returned_years);

    setCurrentMetric('mrr');
  }, []);

  const MonthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const months = MonthNames.map((name, index) => {
    const monthNumber = (index + 1).toString().padStart(2, '0');
    return { number: monthNumber, name: name };
  });

  const datasets = monthly_mmr
    .filter((yearData) => selectedYears.includes(yearData.year))
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

  const datasets_churn = churnRate
    .filter((yearData) => selectedYears.includes(yearData.year))
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

  const data = {
    labels: months.map((month) => month.name),
    datasets: datasets,
  };

  const data_2 = {
    labels: months.map((month) => month.name),
    datasets: datasets_churn,
  };

  function generateRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  }

  function handleYearSelection(year: string) {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  }

  function handleMetricSelection(metric: string) {
    setCurrentMetric(metric);
  }

  return (
    <main className=" min-w-[700px] min-h-[700px] border-4 border-green-200 ">
      <div>Hello world</div>

      <FileUpload setChurnRate={setChurnRate} />
      <div>
        {['mrr', 'churn rate'].map((metric) => (
          <label key={metric}>
            <input
              type="radio"
              name="metric"
              checked={currentMetric.includes(metric)}
              onChange={() => handleMetricSelection(metric)}
            />
            {metric}
          </label>
        ))}
      </div>

      <div>
        {['2022', '2023'].map((year) => (
          <label key={year}>
            <input
              type="checkbox"
              checked={selectedYears.includes(year)}
              onChange={() => handleYearSelection(year)}
            />
            {year}
          </label>
        ))}
      </div>
      <div className=" w-[1200px] h-[800px] border-2 border-yellow-100 mx-auto">
        {renderChart(currentMetric)}
      </div>
    </main>
  );

  function renderChart(metric: string) {
    let default_options = {
      maintainaspectratio: false,
      responsive: true,
    };

    console.log(metric);
    switch (metric) {
      case 'mrr':
        return (
          <BarChart
            data={data}
            options={{
              maintainAspectRatio: false, // Don't maintain w/h ratio
            }}
          />
        );
      case 'churn rate':
        let default_options = {
          maintainaspectratio: false,
          responsive: true,

          scales: {
            y: {
              // beginAtZero: true,
              ticks: {
                callback: (value) => `${value}%`,
              },
            },
          },
        };

        return (
          <div className="  border-4 border-orange-100 ">
            <BarChart
              data={data_2}
              options={{
                maintainAspectRatio: false, // Don't maintain w/h ratio
                responsive: true,
                height: '80vh',
                scales: {
                  y: {
                    // beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </div>
        );
      default:
        return null;
    }
  }
}
