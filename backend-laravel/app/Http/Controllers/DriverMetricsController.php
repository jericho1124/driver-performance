<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Models\Driver;

class DriverMetricsController extends Controller
{
    // 1. Heavy Query with Redis Caching (Fleet Summary)
    public function weeklySummary() { 
        $cacheKey = 'fleet_summary_metrics'; 
        
        // Cache this report for 300 seconds (5 minutes)
        $data = Cache::remember($cacheKey, 300, function () { 
            return DB::table('driver_profiles')
                ->select(
                    DB::raw('COUNT(*) as total_drivers'),
                    DB::raw('SUM(delays_minutes) as total_delays'), 
                    DB::raw('SUM(accidents_count) as total_accidents'), 
                    DB::raw('AVG(rating) as avg_rating')
                ) 
                ->get(); 
        }); 
        
        return response()->json($data); 
    }

    // 2. Top Drivers by Violations (Non-cached real-time data)
    public function topViolators() {
        $drivers = Driver::orderBy('violations_count', 'desc')
                         ->take(10)
                         ->get();
        return response()->json($drivers);
    }

    // 3. Drivers needing Intervention (Accidents > Threshold)
    public function needsIntervention() {
        $drivers = Driver::where('accidents_count', '>', 2) // Threshold > 2
                         ->get();
        return response()->json($drivers);
    }

    // 4. Rating Distribution (The "Trend" of your Fleet)
    public function ratingTrends() {
        $data = [
            '5_star' => Driver::where('rating', '>=', 4.5)->count(),
            '4_star' => Driver::whereBetween('rating', [3.5, 4.49])->count(),
            '3_star' => Driver::whereBetween('rating', [2.5, 3.49])->count(),
            'risk_group' => Driver::where('rating', '<', 2.5)->count(),
        ];

        return response()->json($data);
    }

    // 5. Get List of Drivers (ID and Name only) for the Dropdown
    public function getDriverList() {
        // Cache this list for 10 minutes
        return Cache::remember('driver_list', 600, function () {
            return DB::table('driver_profiles')
                ->select('driver_id')
                ->distinct()
                ->orderBy('driver_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->driver_id,
                        'name' => 'Driver ' . $item->driver_id
                    ];
                });
        });
    }

    // 6. Drilldown: Get Single Driver Details
    public function getDriverDetails($id) {
        $cacheKey = "driver_details_{$id}";

        $driver = Cache::remember($cacheKey, 60, function () use ($id) {
            return DB::table('driver_profiles')
                ->where('driver_id', $id)
                ->select(
                    DB::raw('SUM(delays_minutes) as total_delays'),
                    DB::raw('SUM(accidents_count) as total_accidents'),
                    DB::raw('SUM(violations_count) as total_violations'),
                    DB::raw('AVG(rating) as avg_rating'),
                    DB::raw('COUNT(*) as total_records')
                )
                ->first();
        });

        if (!$driver) {
            return response()->json(['error' => 'Driver not found'], 404);
        }

        return response()->json([
            'id' => $id,
            'driver_id' => $id,
            'name' => 'Driver ' . $id,
            'total_delays' => $driver->total_delays,
            'accidents_count' => $driver->total_accidents,
            'violations_count' => $driver->total_violations,
            'rating' => round($driver->avg_rating, 2),
            'total_records' => $driver->total_records,
            'created_at' => now()->subDays(rand(30, 365))->toDateString() // Simulated join date
        ]);
    }
}