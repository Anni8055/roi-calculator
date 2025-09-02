# Franchise ROI Report Generator - Setup Guide

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

## Frontend Setup

1. Install additional dependencies for PDF generation:
```bash
npm install jspdf jspdf-autotable
```

2. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features

### ✅ Form Handling
- Collects: name, email, phone, city, budget, industry
- Validates required fields with inline error messages
- Real-time form progress tracking

### ✅ Backend API
- `POST /api/franchises` - Submit form data and get recommendations
- `GET /api/health` - Health check endpoint
- Mock data with 10 franchise options
- Smart filtering by budget and industry
- 1.5 second processing delay for realistic UX

### ✅ API Integration
- Frontend calls backend API on form submission
- Loading states with animated spinner
- Error handling with user-friendly messages
- Results displayed in beautiful card layout

### ✅ PDF Generation
- Uses jsPDF + jspdf-autotable
- Includes user details and franchise recommendations table
- Professional formatting with orange theme
- Auto-generated filename: `Franchise_ROI_Report_[Name].pdf`

## API Response Format

```json
{
  "success": true,
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "city": "Delhi",
    "budget": "₹20-50 Lakhs",
    "industry": "Food & Beverage"
  },
  "recommendations": [
    {
      "name": "Subway",
      "investment": "₹15-20 Lakhs",
      "roi": "18%",
      "city": "Delhi",
      "breakEven": "2.5 years",
      "notes": "Fast-growing food franchise with strong brand recognition"
    }
  ],
  "totalFound": 5,
  "generatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Usage

1. Fill out the form with your details
2. Click "Generate My Franchise ROI Report"
3. Wait for API processing (1.5 seconds)
4. View recommendations in the results section
5. Click "Download ROI Report (PDF)" to get your PDF
6. Use "Generate New Report" to start over

## Troubleshooting

- Ensure backend is running on port 3001
- Check browser console for any API errors
- Verify all form fields are filled before submission
- PDF generation requires modern browser support
