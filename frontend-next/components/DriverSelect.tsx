"use client";
import { useRef } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface Driver {
    id: number;
    name: string;
}

interface DriverSelectProps {
    onSelect: (id: string) => void;
    onMonthChange: (month: string) => void;
    selectedDriverId: string | null;
    onClearDriver: () => void;
}

// Generate months for 2025 (based on your CSV data)
const months = [
    { value: '2025-01', label: 'Jan 2025' },
    { value: '2025-02', label: 'Feb 2025' },
    { value: '2025-03', label: 'Mar 2025' },
    { value: '2025-04', label: 'Apr 2025' },
    { value: '2025-05', label: 'May 2025' },
    { value: '2025-06', label: 'Jun 2025' },
    { value: '2025-07', label: 'Jul 2025' },
    { value: '2025-08', label: 'Aug 2025' },
    { value: '2025-09', label: 'Sep 2025' },
    { value: '2025-10', label: 'Oct 2025' },
    { value: '2025-11', label: 'Nov 2025' },
    { value: '2025-12', label: 'Dec 2025' },
];

export default function DriverSelect({ onSelect, onMonthChange, selectedDriverId, onClearDriver }: DriverSelectProps) {
    const { data: drivers, isLoading } = useSWR<Driver[]>('/api/drivers-list', fetcher);
    const driverSelectRef = useRef<HTMLSelectElement>(null);

    const handleClearDriver = () => {
        onClearDriver();
        if (driverSelectRef.current) {
            driverSelectRef.current.value = '';
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
                {/* Driver Select */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Driver</label>
                    <div className="relative flex-1 sm:flex-none">
                        <select 
                            ref={driverSelectRef}
                            className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-auto min-w-[140px]"
                            onChange={(e) => onSelect(e.target.value)}
                            defaultValue=""
                            disabled={isLoading}
                        >
                            <option value="" disabled>{isLoading ? 'Loading...' : 'Select...'}</option>
                            {drivers?.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Clear button */}
                    {selectedDriverId && (
                        <button
                            onClick={handleClearDriver}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            aria-label="Clear driver selection"
                            title="Clear selection"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
                
                {/* Month Select */}
                <div className="flex items-center gap-2 sm:ml-auto">
                    <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Month</label>
                    <select 
                        className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1 sm:flex-none sm:w-auto min-w-[120px]"
                        onChange={(e) => onMonthChange(e.target.value)}
                        defaultValue=""
                    >
                        <option value="">All</option>
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}