"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import useSWR from 'swr';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface RatingData {
  '5_star': number;
  '4_star': number;
  '3_star': number;
  'risk_group': number;
}

interface RatingChartProps {
  month?: string;
}

export default function RatingChart({ month = '' }: RatingChartProps) {
  const apiUrl = month 
    ? `/api/metrics/rating-trends?month=${month}`
    : '/api/metrics/rating-trends';
  
  const { data, error, isLoading } = useSWR<RatingData>(apiUrl, fetcher);

  // Error state with retry
  if (error) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <p className="text-red-500 text-sm mb-2">Failed to load chart</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading || !data) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-full space-y-3 animate-pulse">
          <div className="flex items-end justify-around h-48 gap-4 px-8">
            <div className="bg-gray-200 rounded w-16 h-32"></div>
            <div className="bg-gray-200 rounded w-16 h-40"></div>
            <div className="bg-gray-200 rounded w-16 h-24"></div>
            <div className="bg-gray-200 rounded w-16 h-16"></div>
          </div>
          <div className="flex justify-around px-8">
            <div className="bg-gray-200 rounded h-3 w-12"></div>
            <div className="bg-gray-200 rounded h-3 w-12"></div>
            <div className="bg-gray-200 rounded h-3 w-12"></div>
            <div className="bg-gray-200 rounded h-3 w-12"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  const total = data['5_star'] + data['4_star'] + data['3_star'] + data['risk_group'];
  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No data available for this period
      </div>
    );
  }

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          font: { size: 11 },
          color: '#9ca3af',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 11 },
          color: '#6b7280',
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}
