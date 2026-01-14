# Driver Performance Dashboard

Next.js frontend for visualizing driver performance metrics and analytics.

## Features

- Real-time driver performance dashboard
- Fleet summary statistics (total drivers, average rating, accidents)
- Interactive rating distribution chart
- Auto-refreshing data with SWR
  
## Tech Stack

- **Next.js 16** 
- **TypeScript** -
- **Tailwind CSS 4** 
- **Chart.js** 
- **SWR** 
- **Axios** 

## Prerequisites

- Node.js 20+
- npm or yarn
- Laravel backend running on `http://127.0.0.1:8000`

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure API proxy** (already set in `next.config.ts`):
   - The app proxies `/api/*` requests to Laravel backend at `http://127.0.0.1:8000`

3. **Run development server**:
```bash
npm run dev
```

4. **Open browser**:
   - Navigate to `http://localhost:3000`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
frontend-next/
├── app/
│   ├── page.tsx          # Main dashboard page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── RatingChart.js    # Rating distribution chart
├── public/               # Static assets
└── next.config.ts        # Next.js configuration (API proxy)
```

## API Integration

The dashboard connects to these Laravel API endpoints:

- `/api/metrics/summary` - Fleet summary statistics
- `/api/metrics/rating-trends` - Rating distribution data

## Development Notes

- Ensure Laravel backend is running before starting the frontend
- The API proxy is configured in `next.config.ts`
- All API calls use relative paths (e.g., `/api/metrics/summary`)
- SWR handles caching and automatic revalidation

## Troubleshooting

**"Error loading data. Is Laravel running?"**
- Make sure the Laravel backend is running on port 8000
- Check that Docker containers (MySQL, Redis) are running
- Verify the API endpoints are accessible

**Chart not displaying:**
- Check browser console for errors
- Verify `/api/metrics/rating-trends` returns valid data
- Ensure Chart.js is properly registered

## Production Build

```bash
npm run build
npm run start
```

The production build will be optimized and ready for deployment.
