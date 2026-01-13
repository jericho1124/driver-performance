<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DriverProfileSeeder extends Seeder
{
    /**
     * Seed the driver_profiles table from CSV file.
     */
    public function run(): void
    {
        $csvPath = base_path('../eda-notebooks/driver_profiles.csv');
        
        if (!file_exists($csvPath)) {
            $this->command->error("CSV file not found at: {$csvPath}");
            return;
        }

        $file = fopen($csvPath, 'r');
        
        // Skip header row
        $header = fgetcsv($file);
        
        $batchSize = 500;
        $batch = [];
        $count = 0;

        $this->command->info('Importing driver profiles from CSV...');

        while (($row = fgetcsv($file)) !== false) {
            $batch[] = [
                'driver_id' => (int) $row[0],
                'date' => $row[1],
                'delays_minutes' => (int) $row[2],
                'behavioral_problems' => (int) $row[3],
                'violations_count' => (int) $row[4],
                'accidents_count' => (int) $row[5],
                'rating' => (float) $row[6],
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($batch) >= $batchSize) {
                DB::table('driver_profiles')->insert($batch);
                $count += count($batch);
                $batch = [];
                $this->command->info("Imported {$count} records...");
            }
        }

        // Insert remaining records
        if (!empty($batch)) {
            DB::table('driver_profiles')->insert($batch);
            $count += count($batch);
        }

        fclose($file);

        $this->command->info("Successfully imported {$count} driver profiles!");
    }
}
