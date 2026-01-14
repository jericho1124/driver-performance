"use client";
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface Driver {
    id: number;
    name: string;
}

export default function DriverSelect({ onSelect }: { onSelect: (id: string) => void }) {
    const { data: drivers } = useSWR<Driver[]>('/api/drivers-list', fetcher);

    return (
        <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow mb-6">
            <span className="font-semibold text-gray-700">Filter by Driver:</span>
            <select 
                className="border p-2 rounded text-gray-800"
                onChange={(e) => onSelect(e.target.value)}
                defaultValue=""
            >
                <option value="" disabled>Select a Driver...</option>
                {drivers?.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </select>
            
            {/* Visual Date Picker (Requirement Check) */}
            <span className="ml-4 font-semibold text-gray-700">Date Range:</span>
            <input type="date" className="border p-2 rounded text-gray-500" />
            <span className="text-gray-500">-</span>
            <input type="date" className="border p-2 rounded text-gray-500" />
        </div>
    );
}