"use client";
import useSWR from 'swr';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function DriverModal({ driverId, onClose }: { driverId: string | null, onClose: () => void }) {
    // Only fetch if we have an ID
    const { data: driver } = useSWR(driverId ? `/api/metrics/driver/${driverId}` : null, fetcher);

    if (!driverId) return null; // Don't show if no driver selected

    // Data for a "Driver vs Fleet" comparison chart
    const chartData = {
        labels: ['Driver Rating', 'Fleet Avg (4.0)'],
        datasets: [{
            label: 'Performance',
            data: driver ? [driver.rating, 4.0] : [0, 0],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(200, 200, 200, 0.4)'],
        }]
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative animate-slideUp">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
                >
                    Close
                </button>

                {!driver ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 border-b border-gray-200 pb-4">
                            <h2 className="text-xl font-semibold text-gray-900">{driver.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                ID: {driver.id} · Joined: {new Date(driver.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: Key Stats */}
                            <div className="space-y-4">
                                <div className="p-4 rounded-md border border-gray-200 bg-gray-50">
                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Safety Rating</h3>
                                    <p className="text-3xl font-semibold text-gray-900">{Number(driver.rating).toFixed(1)}</p>
                                </div>
                                
                                <div className="p-4 rounded-md border border-gray-200 bg-gray-50">
                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Accidents</h3>
                                    <p className="text-3xl font-semibold text-gray-900">{driver.accidents_count}</p>
                                </div>
                                
                                <div className="p-4 rounded-md border border-gray-200 bg-gray-50">
                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Violations</h3>
                                    <p className="text-3xl font-semibold text-gray-900">{driver.violations_count}</p>
                                </div>
                            </div>

                            {/* Right: Chart */}
                            <div className="flex items-center justify-center bg-gray-50 rounded-md p-4 border border-gray-200">
                                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}