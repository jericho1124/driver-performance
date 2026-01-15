"use client";
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
}

// Generate months for 2025 (based on your CSV data)
const months = [
    { value: '2025-01', label: 'January 2025' },
    { value: '2025-02', label: 'February 2025' },
    { value: '2025-03', label: 'March 2025' },
    { value: '2025-04', label: 'April 2025' },
    { value: '2025-05', label: 'May 2025' },
    { value: '2025-06', label: 'June 2025' },
    { value: '2025-07', label: 'July 2025' },
    { value: '2025-08', label: 'August 2025' },
    { value: '2025-09', label: 'September 2025' },
    { value: '2025-10', label: 'October 2025' },
    { value: '2025-11', label: 'November 2025' },
    { value: '2025-12', label: 'December 2025' },
];

export default function DriverSelect({ onSelect, onMonthChange }: DriverSelectProps) {
    const { data: drivers } = useSWR<Driver[]>('/api/drivers-list', fetcher);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Driver</label>
                    <select 
                        className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        onChange={(e) => onSelect(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Select...</option>
                        {drivers?.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center gap-3 ml-auto">
                    <label className="text-sm font-medium text-gray-600">Month</label>
                    <select 
                        className="border border-gray-300 px-3 py-2 rounded-md text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        onChange={(e) => onMonthChange(e.target.value)}
                        defaultValue=""
                    >
                        <option value="">All Months</option>
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}