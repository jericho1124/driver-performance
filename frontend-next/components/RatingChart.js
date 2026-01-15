"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useSWR from 'swr';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetcher = url => axios.get(url).then(res => res.data);

export default function RatingChart({ month = '' }) {
  // Build API URL with month filter if provided
  const apiUrl = month 
    ? `/api/metrics/rating-trends?month=${month}`
    : '/api/metrics/rating-trends';
  
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  if (error) return <div className="text-red-500 text-sm">Failed to load chart</div>;
  if (isLoading || !data) return <div className="text-gray-400 text-sm">Loading Chart...</div>;

  const chartData = {
    labels: ['5 Star (4.5+)', '4 Star (3.5-4.5)', '3 Star (2.5-3.5)', 'Risk (< 2.5)'],
    datasets: [
      {
        label: 'Number of Drivers',
        data: [data['5_star'], data['4_star'], data['3_star'], data['risk_group']],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', 
          'rgba(59, 130, 246, 0.8)', 
          'rgba(251, 191, 36, 0.8)', 
          'rgba(239, 68, 68, 0.8)', 
        ],
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}