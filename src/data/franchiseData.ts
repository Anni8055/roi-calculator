export interface Franchise {
  brand: string;
  industry: string;
  investment: string;
  roi_percent: string;
  break_even: string;
  notes: string;
}

export const franchiseDataset: Franchise[] = [
  {
    brand: "Subway",
    industry: "Food",
    investment: "₹15–30 Lakh",
    roi_percent: "22%",
    break_even: "2.5 years",
    notes: "Global sandwich chain with strong brand value"
  },
  {
    brand: "Biryani by Kilo",
    industry: "Food",
    investment: "₹20–25 Lakh",
    roi_percent: "28%",
    break_even: "2 years",
    notes: "Cloud kitchen friendly with high demand in metros"
  },
  {
    brand: "Chai Sutta Bar",
    industry: "Food",
    investment: "₹10–20 Lakh",
    roi_percent: "25%",
    break_even: "1.8 years",
    notes: "Youth-focused tea chain expanding rapidly"
  },
  {
    brand: "VLCC",
    industry: "Fitness",
    investment: "₹30–50 Lakh",
    roi_percent: "30%",
    break_even: "2.2 years",
    notes: "Well-known wellness & beauty brand"
  },
  {
    brand: "Anytime Fitness",
    industry: "Fitness",
    investment: "₹40–50 Lakh",
    roi_percent: "32%",
    break_even: "2 years",
    notes: "Global gym brand with 24/7 model"
  },
  {
    brand: "Kidzee",
    industry: "Education",
    investment: "₹12–20 Lakh",
    roi_percent: "35%",
    break_even: "1.5 years",
    notes: "Leading preschool chain in India"
  },
  {
    brand: "Aptech Learning",
    industry: "Education",
    investment: "₹20–30 Lakh",
    roi_percent: "27%",
    break_even: "2 years",
    notes: "Tech education franchise with strong placement support"
  },
  {
    brand: "Naturals Ice Cream",
    industry: "Food", 
    investment: "₹15–25 Lakh",
    roi_percent: "24%",
    break_even: "2.2 years",
    notes: "Premium ice cream brand with seasonal popularity"
  },
  {
    brand: "Crossfit Box",
    industry: "Fitness",
    investment: "₹25–40 Lakh", 
    roi_percent: "29%",
    break_even: "2.3 years",
    notes: "High-intensity fitness franchise with dedicated community"
  },
  {
    brand: "Reliance Smart",
    industry: "Retail",
    investment: "₹40–60 Lakh",
    roi_percent: "26%",
    break_even: "2.8 years", 
    notes: "Retail chain with strong supply chain support"
  },
  {
    brand: "Looks Salon",
    industry: "Salon",
    investment: "₹15–30 Lakh",
    roi_percent: "31%",
    break_even: "2.1 years",
    notes: "Popular salon chain with trained staff support"
  },
  {
    brand: "Jawed Habeebs",
    industry: "Salon", 
    investment: "₹20–35 Lakh",
    roi_percent: "28%",
    break_even: "2.4 years",
    notes: "Premium salon brand with celebrity endorsement"
  }
];

export const budgetRanges = [
  "₹10–20 Lakh",
  "₹20–50 Lakh", 
  "₹50 Lakh+"
];

export const industries = [
  "Food",
  "Fitness", 
  "Education",
  "Retail",
  "Salon",
  "Other"
];

export function filterFranchisesByBudgetAndIndustry(
  budget: string,
  industry: string
): Franchise[] {
  return franchiseDataset.filter(franchise => {
    // Budget matching logic
    const budgetMatch = matchesBudgetRange(franchise.investment, budget);
    
    // Industry matching logic
    const industryMatch = industry === "Other" || franchise.industry === industry;
    
    return budgetMatch && industryMatch;
  });
}

function matchesBudgetRange(franchiseInvestment: string, selectedBudget: string): boolean {
  // Extract numeric values from investment range
  const investmentNumbers = extractNumbersFromRange(franchiseInvestment);
  const budgetNumbers = extractNumbersFromRange(selectedBudget);
  
  if (!investmentNumbers || !budgetNumbers) return false;
  
  // Check if there's overlap between the ranges
  return investmentNumbers.max >= budgetNumbers.min && investmentNumbers.min <= budgetNumbers.max;
}

function extractNumbersFromRange(range: string): { min: number; max: number } | null {
  const match = range.match(/₹(\d+)(?:–(\d+))?\s*Lakh/);
  if (!match) return null;
  
  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : (range.includes('+') ? 100 : min);
  
  return { min, max };
}