const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock franchise data
const mockFranchises = [
  { name: "Subway", investment: "₹15-20 Lakhs", roi: "18%", city: "Delhi", breakEven: "2.5 years", notes: "Fast-growing food franchise with strong brand recognition" },
  { name: "KFC", investment: "₹30-40 Lakhs", roi: "20%", city: "Mumbai", breakEven: "3 years", notes: "Global fast-food chain with high footfall locations" },
  { name: "McDonald's", investment: "₹50-70 Lakhs", roi: "22%", city: "Bangalore", breakEven: "3.5 years", notes: "Premium fast-food franchise with excellent support" },
  { name: "Domino's", investment: "₹25-35 Lakhs", roi: "19%", city: "Chennai", breakEven: "2.8 years", notes: "Pizza delivery franchise with strong market presence" },
  { name: "Pizza Hut", investment: "₹35-45 Lakhs", roi: "17%", city: "Hyderabad", breakEven: "3.2 years", notes: "Casual dining pizza franchise with dine-in options" },
  { name: "Cafe Coffee Day", investment: "₹20-30 Lakhs", roi: "16%", city: "Pune", breakEven: "3 years", notes: "Coffee chain franchise with good profit margins" },
  { name: "Starbucks", investment: "₹40-60 Lakhs", roi: "21%", city: "Gurgaon", breakEven: "3.5 years", notes: "Premium coffee franchise with high brand value" },
  { name: "Baskin Robbins", investment: "₹18-25 Lakhs", roi: "15%", city: "Kolkata", breakEven: "2.5 years", notes: "Ice cream franchise with seasonal variations" },
  { name: "Dunkin' Donuts", investment: "₹22-32 Lakhs", roi: "18%", city: "Ahmedabad", breakEven: "2.8 years", notes: "Donut and coffee franchise with morning rush" },
  { name: "Burger King", investment: "₹28-38 Lakhs", roi: "19%", city: "Jaipur", breakEven: "3 years", notes: "Burger franchise with competitive pricing" }
];

// Filter franchises based on budget and industry
function filterFranchises(budget, industry, city) {
  let filtered = [...mockFranchises];
  
  // Filter by budget range
  if (budget) {
    const budgetRanges = {
      "₹5-10 Lakhs": { min: 5, max: 10 },
      "₹10-20 Lakhs": { min: 10, max: 20 },
      "₹20-50 Lakhs": { min: 20, max: 50 },
      "₹50 Lakhs+": { min: 50, max: 1000 }
    };
    
    const range = budgetRanges[budget];
    if (range) {
      filtered = filtered.filter(franchise => {
        const investment = franchise.investment.match(/₹(\d+)-(\d+)/);
        if (investment) {
          const min = parseInt(investment[1]);
          const max = parseInt(investment[2]);
          return (min >= range.min && max <= range.max) || 
                 (min >= range.min && range.max >= min);
        }
        return false;
      });
    }
  }
  
  // Filter by industry (simplified mapping)
  if (industry && industry !== "Any") {
    const industryMapping = {
      "Food & Beverage": ["Subway", "KFC", "McDonald's", "Domino's", "Pizza Hut", "Cafe Coffee Day", "Starbucks", "Baskin Robbins", "Dunkin' Donuts", "Burger King"],
      "Retail": ["Subway", "KFC", "McDonald's"],
      "Healthcare": ["Subway", "KFC"],
      "Education": ["Subway", "KFC"],
      "Technology": ["Subway", "KFC"]
    };
    
    const allowedFranchises = industryMapping[industry] || [];
    filtered = filtered.filter(franchise => allowedFranchises.includes(franchise.name));
  }
  
  // Sort by ROI (highest first)
  filtered.sort((a, b) => {
    const roiA = parseInt(a.roi.replace('%', ''));
    const roiB = parseInt(b.roi.replace('%', ''));
    return roiB - roiA;
  });
  
  // Return top 5 recommendations
  return filtered.slice(0, 5);
}

// API Routes
app.post('/api/franchises', (req, res) => {
  try {
    const { name, email, phone, city, budget, industry } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !city || !budget || !industry) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Please fill in all required fields"
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
        message: "Please enter a valid email address"
      });
    }
    
    // Validate phone format
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone format",
        message: "Please enter a valid phone number"
      });
    }
    
    // Get filtered recommendations
    const recommendations = filterFranchises(budget, industry, city);
    
    // Simulate processing delay
    setTimeout(() => {
      res.json({
        success: true,
        user: { name, email, phone, city, budget, industry },
        recommendations,
        totalFound: recommendations.length,
        generatedAt: new Date().toISOString()
      });
    }, 1500); // 1.5 second delay to show loading state
    
  } catch (error) {
    console.error('Error processing franchise request:', error);
    res.status(500).json({
      error: "Internal server error",
      message: "Something went wrong. Please try again."
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Franchise API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Franchise endpoint: http://localhost:${PORT}/api/franchises`);
});

module.exports = app;
