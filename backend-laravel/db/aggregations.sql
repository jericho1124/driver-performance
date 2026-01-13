-- Average delays per driver
SELECT driver_id, AVG(delays_minutes) as avg_delay
FROM driver_profiles
GROUP BY driver_id;

-- Weekly totals
SELECT 
    strftime('%Y-%W', date) as week,
    SUM(delays_minutes) as total_delays,
    SUM(accidents_count) as total_accidents,
    AVG(rating) as avg_rating
FROM driver_profiles
GROUP BY week
ORDER BY week;
