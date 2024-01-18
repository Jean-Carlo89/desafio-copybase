'use client';
import {
  caclulate_mmr,
  calculate_monthly_mmr,
  test_parse,
} from '@/helpers/mmr';
import Image from 'next/image';
import { BarChart } from './components/chart';
import React, { useEffect, useState } from 'react';
import { stringify } from 'querystring';

export default function Home() {
  const [mmr, setMmr] = useState<
    [{ year: string; months: { [key: string]: number } }]
  >([]);

  const [selectedYears, setSelectedYears] = useState([]);

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

  useEffect(() => {
    setMmr(monthly_mmr);
    const returned_years = monthly_mmr.map((item) => {
      return item.year;
    });

    setSelectedYears(returned_years);
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

  const data = {
    labels: months.map((month) => month.name),
    datasets: datasets,
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

  return (
    <main>
      <div>Hello world</div>

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
      <div>
        <BarChart data={data} />
      </div>
    </main>
  );
}
