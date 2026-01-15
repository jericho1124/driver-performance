"use client";

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import RatingChart from '../components/RatingChart';
import DriverSelect from '../components/DriverSelect';
import DriverModal from '../components/DriverModal';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface DashboardStats {
  total_drivers: number;
  total_delays: string;
  total_accidents: string;
  avg_rating: string;
}

// Skeleton loader for KPI cards
function KpiSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
      <div className="h-8 bg-gray-200 rounded w-16"></div>
    </div>
  );
}

// Format minutes to hours/minutes
function formatDelay(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Format relative time
function getRelativeTime(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const { data: summary, error, mutate, isValidating } = useSWR<DashboardStats[]>('/api/metrics/summary', fetcher);
  
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState<string>('');

  // Update lastUpdated when data loads
  useEffect(() => {
    if (summary && !isValidating) {
      setLastUpdated(new Date());
    }
  }, [summary, isValidating]);

  // Update relative time every minute
  useEffect(() => {
    if (!lastUpdated) return;
    setRelativeTime(getRelativeTime(lastUpdated));
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(lastUpdated));
    }, 60000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleRefresh = () => {
    mutate();
  };

  // Error state with retry
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-md">
          <div className="text-red-500 text-lg mb-2">Failed to load dashboard</div>
          <p className="text-gray-500 text-sm mb-4">Make sure Laravel backend is running on port 8000</p>
          <button 
            onClick={() => mutate()}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (!summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 animate-pulse">
            <div className="flex gap-6">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-40 ml-auto"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = summary[0]; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Driver Performance</h1>
              <p className="text-gray-500 mt-1">Fleet analytics and insights</p>
            </div>
            
            {/* Refresh + Last Updated */}
            <div className="flex items-center gap-3">
              {relativeTime && (
                <span className="text-xs text-gray-400">Updated {relativeTime}</span>
              )}
              <button
                onClick={handleRefresh}
                disabled={isValidating}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <svg 
                  className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <DriverSelect 
            onSelect={setSelectedDriverId} 
            onMonthChange={setSelectedMonth}
            selectedDriverId={selectedDriverId}
            onClearDriver={() => setSelectedDriverId(null)}
          />

          {/* KPI Cards - 4 cards now */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Drivers</h2>
              <p className="text-2xl md:text-3xl font-semibold text-gray-900">{stats.total_drivers?.toLocaleString() ?? '—'}</p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Avg Rating</h2>
              <p className="text-2xl md:text-3xl font-semibold text-gray-900">
                {stats.avg_rating ? Number(stats.avg_rating).toFixed(2) : '—'}
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Accidents</h2>
              <p className="text-2xl md:text-3xl font-semibold text-gray-900">{stats.total_accidents?.toLocaleString() ?? '—'}</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Total Delays</h2>
              <p className="text-2xl md:text-3xl font-semibold text-gray-900">
                {stats.total_delays ? formatDelay(Number(stats.total_delays)) : '—'}
              </p>
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
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 px-4 md:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>Driver Performance Dashboard v1.0</span>
          <span>Built with Next.js, Laravel & Cursor AI</span>
        </div>
      </footer>

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