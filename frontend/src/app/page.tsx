'use client';

import Image from 'next/image';
import { BarChart } from './components/BarChart';
import React, { useEffect, useState } from 'react';
import { stringify } from 'querystring';
import { LineChart } from './components/LineChart';
import FileUpload from './components/FileUpload';
import { stub_mrr } from '@/helpers/fake_mrr';
import { fake_churn_rate } from '@/helpers/fake_churn_rate';
import { months_array } from '@/helpers/months_array';

export default function Home() {
  const [mrr, setMrr] = useState<
    [{ year: string; months: { [key: string]: number } }]
  >([]);

  const [churnRate, setChurnRate] = useState<
    [{ year: string; months: { [key: string]: number } }]
  >([]);

  const [selectedYears, setSelectedYears] = useState([]);

  const [years, setYears] = useState([]);

  const [currentMetric, setCurrentMetric] = useState([]);

  const monthly_mmr = stub_mrr;

  const fake_monthly_churn_rate = fake_churn_rate;

  useEffect(() => {
    setCurrentMetric('mrr');
  }, []);

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
    <main className=" min-w-[700px] min-h-[700px] border-4 border-green-200  ">
      <div className="flex flex-col h-full w-[85%] border-4 border-red-200 mx-auto ">
        {' '}
        <FileUpload
          setChurnRate={setChurnRate}
          setMrr={setMrr}
          setSelectedYears={setSelectedYears}
          setYears={setYears}
        />
        <div>
          {['MRR', 'Churn Rate'].map((metric) => (
            <div key={metric} className="flex flex-col">
              <label key={metric}>
                <input
                  type="radio"
                  name="metric"
                  checked={currentMetric.includes(metric)}
                  onChange={() => handleMetricSelection(metric)}
                />
                {metric}
              </label>
            </div>
          ))}
        </div>
        <div>
          {years.map((year) => (
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
      </div>
    </main>
  );

  function renderChart(metric: string) {
    let default_options = {
      maintainaspectratio: false,
      responsive: true,
    };

    switch (metric) {
      case 'MRR':
        return (
          <BarChart
            metric_array={mrr}
            // data={mrr_data}
            selectedYears={selectedYears}
            options={{
              maintainAspectRatio: false, // Don't maintain w/h ratio
            }}
          />
        );
      case 'Churn Rate':
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
              metric_array={churnRate}
              selectedYears={selectedYears}
              //  data={churn_data}
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
