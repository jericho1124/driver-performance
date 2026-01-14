"use client";

import { useState } from 'react'; // Import State
import useSWR from 'swr';
import axios from 'axios';
import RatingChart from '../components/RatingChart';
import DriverSelect from '../components/DriverSelect'; // Import
import DriverModal from '../components/DriverModal';   // Import

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface DashboardStats {
  total_drivers: number;
  total_delays: string;
  total_accidents: string;
  avg_rating: string;
}

export default function Dashboard() {
  const { data: summary, error } = useSWR<DashboardStats[]>('/api/metrics/summary', fetcher);
  
  // State to track which driver is selected
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  if (error) return <div className="p-10">Error loading data. Is Laravel running?</div>;
  if (!summary) return <div className="p-10">Loading Dashboard...</div>;

  const stats = summary[0]; 

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Driver Performance Dashboard</h1>

      {/* 1. Add the Filter Bar */}
      <DriverSelect onSelect={setSelectedDriverId} />

      {/* 2. Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm uppercase">Total Drivers</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.total_drivers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm uppercase">Fleet Average Rating</h2>
          <p className="text-3xl font-bold text-green-600">{Number(stats.avg_rating).toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm uppercase">Total Accidents</h2>
          <p className="text-3xl font-bold text-red-600">{stats.total_accidents}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">Driver Rating Distribution</h2>
        <RatingChart />
      </div>

      {/* 3. The Modal (Only appears when an ID is set) */}
      {selectedDriverId && (
          <DriverModal 
            driverId={selectedDriverId} 
            onClose={() => setSelectedDriverId(null)} 
          />
      )}
    </div>
  );
}