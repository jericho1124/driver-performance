<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\DriverMetricsController;

// Basic Driver Info
Route::get('/drivers', [DriverController::class, 'index']);
Route::get('/drivers/{id}', [DriverController::class, 'show']);

// Day 3: Analytics & Redis Caching
Route::get('/metrics/summary', [DriverMetricsController::class, 'weeklySummary']);
Route::get('/metrics/top-violators', [DriverMetricsController::class, 'topViolators']);
Route::get('/metrics/interventions', [DriverMetricsController::class, 'needsIntervention']);
Route::get('/metrics/rating-trends', [DriverMetricsController::class, 'ratingTrends']);
Route::get('/drivers-list', [DriverMetricsController::class, 'getDriverList']);
Route::get('/metrics/driver/{id}', [DriverMetricsController::class, 'getDriverDetails']);