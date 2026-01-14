## Day 3: API & Redis Caching

This project uses **Redis** to cache heavy database queries for performance.

### Analytics Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/metrics/summary` | Fleet-wide averages (Cached via Redis for 5 mins) |
| `GET` | `/api/metrics/top-violators` | Top 10 drivers with most violations |
| `GET` | `/api/metrics/interventions` | Drivers with >2 accidents |
| `GET` | `/api/metrics/rating-trends` | Distribution of driver ratings (Histogram) |

### 🧹 Cache Invalidation
The "Fleet Summary" is cached for **300 seconds** (5 minutes). 
To force an update and clear the Redis cache manually, run:

```bash
php artisan cache:clear
# OR specifically for Redis
php artisan cache:store:redis:flush