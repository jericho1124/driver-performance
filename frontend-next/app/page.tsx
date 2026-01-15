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
  // State to track selected month
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  if (error) return <div className="p-10">Error loading data. Is Laravel running?</div>;
  if (!summary) return <div className="p-10">Loading Dashboard...</div>;

  const stats = summary[0]; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Driver Performance</h1>
          <p className="text-gray-500 mt-1">Fleet analytics and insights</p>
        </div>

        {/* Filter Bar */}
        <DriverSelect onSelect={setSelectedDriverId} onMonthChange={setSelectedMonth} />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Drivers</h2>
            <p className="text-3xl font-semibold text-gray-900">{stats.total_drivers}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Fleet Avg Rating</h2>
            <p className="text-3xl font-semibold text-gray-900">{Number(stats.avg_rating).toFixed(2)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Accidents</h2>
            <p className="text-3xl font-semibold text-gray-900">{stats.total_accidents}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Rating Distribution
            {selectedMonth && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
              </span>
            )}
          </h2>
          <RatingChart month={selectedMonth} />
        </div>
      </div>

      {/* Modal */}
      {selectedDriverId && (
        <DriverModal 
          driverId={selectedDriverId} 
          onClose={() => setSelectedDriverId(null)} 
        />
      )}
    </div>
  );
}