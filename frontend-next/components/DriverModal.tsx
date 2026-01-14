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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold">
                    ✕ CLOSE
                </button>

                {!driver ? (
                    <p>Loading details...</p>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2 text-gray-800">{driver.name}</h2>
                        <p className="text-gray-500 mb-6">ID: #{driver.id} • Joined: {new Date(driver.created_at).toLocaleDateString()}</p>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Left: Key Stats */}
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                    <h3 className="text-blue-800 text-sm font-bold uppercase">Safety Rating</h3>
                                    <p className="text-4xl font-bold text-blue-600">{Number(driver.rating).toFixed(1)}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded border border-red-100">
                                    <h3 className="text-red-800 text-sm font-bold uppercase">Total Accidents</h3>
                                    <p className="text-4xl font-bold text-red-600">{driver.accidents_count}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                                    <h3 className="text-yellow-800 text-sm font-bold uppercase">Total Violations</h3>
                                    <p className="text-4xl font-bold text-yellow-600">{driver.violations_count}</p>
                                </div>
                            </div>

                            {/* Right: Chart */}
                            <div className="flex items-center justify-center">
                                <Bar data={chartData} options={{ responsive: true }} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}