# Franchise API Backend

Backend API server for the Franchise ROI Report Generator.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/franchises
Submit form data to get franchise recommendations.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "city": "Delhi",
  "budget": "₹20-50 Lakhs",
  "industry": "Food & Beverage"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "recommendations": [
    {
      "name": "Subway",
      "investment": "₹15-20 Lakhs",
      "roi": "18%",
      "city": "Delhi",
      "breakEven": "2.5 years",
      "notes": "Fast-growing food franchise..."
    }
  ],
  "totalFound": 5,
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Server Details

- **Port:** 3001 (default)
- **CORS:** Enabled for all origins
- **Processing Delay:** 1.5 seconds (simulated)
- **Mock Data:** 10 franchise options with filtering logic
