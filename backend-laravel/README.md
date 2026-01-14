# Driver Performance API

Laravel API for tracking and analyzing driver performance metrics.

## Features

- Driver performance tracking (delays, accidents, violations, ratings)
- Analytics endpoints with Redis caching
- CSV data import
- MySQL database with optimized queries

## Setup

### Prerequisites

- PHP 8.2+
- Composer
- Docker & Docker Compose

### Installation

1. **Start Docker services** (MySQL & Redis):
```bash
docker-compose up -d
```

2. **Install dependencies**:
```bash
composer install
```

3. **Configure environment**:
```bash
cp .env.example .env
php artisan key:generate
```

4. **Update `.env` database settings**:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=driver_db
DB_USERNAME=root
DB_PASSWORD=root

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

5. **Run migrations**:
```bash
php artisan migrate
```

6. **Seed database** (imports CSV data):
```bash
php artisan db:seed
```

7. **Start server**:
```bash
php artisan serve
```

API will be available at `http://127.0.0.1:8000`

## API Endpoints

### Driver Metrics

- `GET /api/metrics/summary` - Fleet summary (cached 5 min)
- `GET /api/metrics/top-violators` - Top 10 drivers by violations
- `GET /api/metrics/interventions` - Drivers needing intervention (accidents > 2)
- `GET /api/metrics/rating-trends` - Rating distribution

### Driver Info

- `GET /api/drivers` - List all drivers
- `GET /api/drivers/{id}` - Get driver details

## Database Schema

**driver_profiles** table:
- `id` - Primary key
- `driver_id` - Driver identifier
- `date` - Record date
- `delays_minutes` - Delay time
- `behavioral_problems` - Behavioral issue count
- `violations_count` - Violation count
- `accidents_count` - Accident count
- `rating` - Driver rating (decimal 3,2)
- `created_at`, `updated_at` - Timestamps

## SQL Aggregations

See `db/aggregations.sql` for example queries:
- Average delays per driver
- Weekly totals and averages

## Tech Stack

- Laravel 12
- MySQL 8.0
- Redis (caching)
- PHP 8.2
