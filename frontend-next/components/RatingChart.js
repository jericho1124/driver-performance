"use client"; // This is a Client Component

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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetcher = url => axios.get(url).then(res => res.data);

export default function RatingChart() {
  // Fetch data from our Day 3 Endpoint
  const { data, error } = useSWR('/api/metrics/rating-trends', fetcher);

  if (error) return <div>Failed to load chart</div>;
  if (!data) return <div>Loading Chart...</div>;

  // Transform the Day 3 JSON data into Chart data
  const chartData = {
    labels: ['5 Star', '4 Star', '3 Star', 'Risk Group (< 2.5)'],
    datasets: [
      {
        label: 'Number of Drivers',
        data: [data['5_star'], data['4_star'], data['3_star'], data['risk_group']],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', 
          'rgba(54, 162, 235, 0.6)', 
          'rgba(255, 206, 86, 0.6)', 
          'rgba(255, 99, 132, 0.6)', 
        ],
      },
    ],
  };

  return <Bar data={chartData} />;
}