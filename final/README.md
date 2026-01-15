Driver Performance Dashboard
Full-stack driver performance project:

Backend: Laravel API + MySQL + Redis
Frontend: Next.js dashboard (proxies /api/* to Laravel)
BI: Metabase dashboard
Features
Real-time driver performance dashboard
Fleet summary statistics (total drivers, average rating, accidents)
Interactive rating distribution chart
Auto-refreshing data with SWR
Tech Stack
Next.js 16
TypeScript
Tailwind CSS 4
Chart.js
SWR
Axios
Prerequisites
Node.js 20+
npm or yarn
PHP 8.2+ and Composer (for Laravel)
Docker & Docker Compose (for MySQL, Redis, Metabase)
Quickstart (run everything locally)
1) Start Docker services (MySQL + Redis + Metabase)
From the repo root:

docker-compose up -d
2) Start Laravel API
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
Laravel will run at http://127.0.0.1:8000.

3) Start Next.js frontend
cd ../frontend-next
npm install
npm run dev
Open http://localhost:3000.

Available Scripts
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
Project Structure
backend-laravel/          # Laravel API
frontend-next/
├── app/
│   ├── page.tsx          # Main dashboard page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── RatingChart.js    # Rating distribution chart
├── public/               # Static assets
└── next.config.ts        # Next.js configuration (API proxy)
API Integration
The dashboard connects to these Laravel API endpoints:

/api/metrics/summary - Fleet summary statistics
/api/metrics/rating-trends - Rating distribution data
/api/drivers-list - Dropdown driver list
/api/metrics/driver/{id} - Driver detail (modal)
Metabase
Metabase UI: http://localhost:3001
Public dashboard link: http://localhost:3001/public/dashboard/be9e12ff-e30d-41e7-8b84-25fa844ad37d
Metabase - Driver Performance Dashboard.pdf
Note: because this uses localhost, it’s only accessible on your computer unless you host it.

Development Notes
Ensure Laravel is running before starting the frontend
The API proxy is configured in frontend-next/next.config.ts
All API calls use relative paths (e.g., /api/metrics/summary)
SWR handles caching and automatic revalidation
Troubleshooting
"Error loading data. Is Laravel running?"

Make sure the Laravel backend is running on port 8000
Check that Docker containers (MySQL, Redis) are running
Verify the API endpoints are accessible
Chart not displaying:

Check browser console for errors
Verify /api/metrics/rating-trends returns valid data
Ensure Chart.js is properly registered