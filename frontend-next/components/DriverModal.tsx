"use client";
import { useEffect, useCallback } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface DriverData {
    id: number;
    name: string;
    rating: number;
    accidents_count: number;
    violations_count: number;
    total_delays: number;
    created_at: string;
}

interface DriverModalProps {
    driverId: string | null;
    onClose: () => void;
}

export default function DriverModal({ driverId, onClose }: DriverModalProps) {
    const { data: driver, error } = useSWR<DriverData>(
        driverId ? `/api/metrics/driver/${driverId}` : null, 
        fetcher
    );

    // Close on ESC key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [handleKeyDown]);

    if (!driverId) return null;

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const chartData = {
        labels: ['Driver', 'Fleet Avg'],
        datasets: [{
            label: 'Rating',
            data: driver ? [driver.rating, 4.0] : [0, 0],
            backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(156, 163, 175, 0.5)'],
            borderRadius: 4,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1f2937',
                padding: 10,
                cornerRadius: 6,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 11 }, color: '#9ca3af' },
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#6b7280' },
            },
        },
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative animate-slideUp max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
                    aria-label="Close modal"
                >
                    Close
                </button>

                {error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-red-500 text-sm mb-2">Failed to load driver data</p>
                        <button 
                            onClick={onClose}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Close
                        </button>
                    </div>
                ) : !driver ? (
                    <div className="py-12 space-y-4 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="grid grid-cols-2 gap-6 mt-6">
                            <div className="space-y-4">
                                <div className="h-20 bg-gray-200 rounded"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-48 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 border-b border-gray-200 pb-4">
                            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">{driver.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                ID: {driver.id} · Joined: {new Date(driver.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Rating Comparison</h3>
                                <div className="h-40">
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}