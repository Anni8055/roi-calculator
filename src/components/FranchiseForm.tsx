import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { budgetRanges, industries } from "@/data/franchiseData";
import { TrendingUp, BarChart3, Shield, Sparkles, CheckCircle, AlertCircle, Smartphone, Zap, Target, Download, FileText } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export interface FormData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  industry: string;
  city: string;
}

export interface FranchiseRecommendation {
  name: string;
  investment: string;
  roi: string;
  city: string;
  breakEven: string;
  notes: string;
}

export interface ApiResponse {
  success: boolean;
  user: FormData;
  recommendations: FranchiseRecommendation[];
  totalFound: number;
  generatedAt: string;
}

interface FranchiseFormProps {
  onSubmit?: (data: FormData) => void;
  isLoading?: boolean;
}

export function FranchiseForm({ onSubmit, isLoading: externalLoading }: FranchiseFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formProgress, setFormProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<FranchiseRecommendation[]>([]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: "onChange"
  });

  const watchedBudget = watch("budget");
  const watchedIndustry = watch("industry");
  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedPhone = watch("phone");
  const watchedCity = watch("city");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = e.currentTarget?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const formElement = document.querySelector('.franchise-form');
    if (formElement) {
      formElement.addEventListener('mousemove', handleMouseMove);
      return () => formElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  // Calculate form progress
  const calculateProgress = () => {
    const fields = [watchedName, watchedEmail, watchedPhone, watchedBudget, watchedIndustry, watchedCity];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return (filledFields / fields.length) * 100;
  };

  // Update progress when fields change
  useEffect(() => {
    setFormProgress(calculateProgress());
  }, [watchedName, watchedEmail, watchedPhone, watchedBudget, watchedIndustry, watchedCity]);

  // API call to get franchise recommendations
  const fetchRecommendations = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use relative path for production, fallback to localhost for development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/franchises' 
        : 'http://localhost:3001/api/franchises';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recommendations');
      }

      const data: ApiResponse = await response.json();
      setRecommendations(data.recommendations);
      setUserData(data.user);
      setShowResults(true);
      
      // Call external onSubmit if provided
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    if (!userData || !recommendations.length) return;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Franchise ROI Report', 20, 30);
    
    // User details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('User Information', 20, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${userData.name}`, 20, 65);
    doc.text(`Email: ${userData.email}`, 20, 75);
    doc.text(`Phone: ${userData.phone}`, 20, 85);
    doc.text(`City: ${userData.city}`, 20, 95);
    doc.text(`Budget: ${userData.budget}`, 20, 105);
    doc.text(`Industry: ${userData.industry}`, 20, 115);
    
    // Recommendations table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Recommended Franchises', 20, 135);
    
    // Prepare table data
    const tableData = recommendations.map((rec, index) => [
      index + 1,
      rec.name,
      rec.investment,
      rec.roi,
      rec.breakEven,
      rec.city
    ]);
    
    // Create table
    (doc as any).autoTable({
      head: [['Rank', 'Franchise', 'Investment', 'ROI', 'Break-even', 'City']],
      body: tableData,
      startY: 145,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [255, 87, 51], // Orange color
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
        20,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save PDF
    doc.save(`Franchise_ROI_Report_${userData.name.replace(/\s+/g, '_')}.pdf`);
  };

  // Handle form submission
  const handleFormSubmit = async (data: FormData) => {
    await fetchRecommendations(data);
  };

  const commonInputClass =
    "h-14 text-base bg-white placeholder:text-gray-500 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-lg focus:ring-2 focus:ring-[#FF5733]/40 focus:border-[#FF5733]/60 focus:outline-none relative z-10 w-full";

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100">
      <motion.div 
        className="w-full max-w-5xl animate-fade-in franchise-form"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        }}
      >
        {/* Wrapper (clean professional) */}
        <div className="relative">
          {/* Main Form Card */}
          <Card className="border border-gray-100 bg-white shadow-lg rounded-3xl overflow-hidden relative z-10">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#FF5733] to-[#FF7849]" />
            
            <CardHeader className="text-center pb-8 pt-12 px-6 md:px-12 relative">
              {/* Decorative header icon removed for a cleaner look */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  Franchise ROI Report Generator
                </CardTitle>
                
                <CardDescription className="text-base md:text-lg text-gray-600 max-w-md mx-auto font-medium">
                  Get personalized franchise recommendations in 2 minutes.
                </CardDescription>
              </motion.div>

              {/* Thin orange progress bar */}
              <motion.div 
                className="mt-8 max-w-md mx-auto relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mb-3 text-center text-sm font-medium text-gray-700">
                  Form Progress: <span className="text-[#FF5733] font-semibold">{Math.round(formProgress)}%</span>
                </div>
                
                {/* Progress Container */}
                <div className="relative" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(formProgress)} aria-label="Form completion">
                  <div className="w-full bg-gray-200/70 rounded-full h-2 overflow-hidden" aria-hidden="true">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#FF5733] to-[#FF7849] rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${formProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </CardHeader>
            
            <CardContent className="px-6 md:px-12 pb-12 relative">
              {/* Loading State with 3D Effects */}
              {isLoading && (
                <motion.div 
                  className="mb-8 relative"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Generating your report...</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </motion.div>
                  </div>
                  
                  {/* 3D Loading Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/20">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </motion.div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-sm transform translate-y-1"></div>
                  </div>
                </motion.div>
              )}

              <motion.form 
                onSubmit={handleSubmit(handleFormSubmit)} 
                className="space-y-6 md:space-y-8"
                variants={formVariants}
              >
                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name with 3D Input */}
                  <motion.div variants={fieldVariants} className="space-y-3 group">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#FF5733]" />
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-[#FF5733]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ transform: 'translateZ(-10px)' }}
                      />
                      <Input
                        id="name"
                        {...register("name", { 
                          required: "Name is required",
                          minLength: { value: 2, message: "Name must be at least 2 characters" }
                        })}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={commonInputClass}
                        placeholder="Enter your full name"
                      />
                      {watchedName && watchedName.length >= 2 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500 drop-shadow-lg" />
                        </motion.div>
                      )}
                    </div>
                    {errors.name && (
                      <motion.p 
                        id="name-error"
                        className="text-sm text-destructive font-medium flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.name.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Email with 3D Input */}
                  <motion.div variants={fieldVariants} className="space-y-3 group">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#FF5733]" />
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-[#FF7849]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ transform: 'translateZ(-10px)' }}
                      />
                      <Input
                        id="email"
                        type="email"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address"
                          }
                        })}
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={commonInputClass}
                        placeholder="Enter your email"
                      />
                      {watchedEmail && /^\S+@\S+$/i.test(watchedEmail) && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500 drop-shadow-lg" />
                        </motion.div>
                      )}
                    </div>
                    {errors.email && (
                      <motion.p 
                        id="email-error"
                        className="text-sm text-destructive font-medium flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Phone with 3D Input */}
                  <motion.div variants={fieldVariants} className="space-y-3 group">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#FF5733]" />
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-[#FF5733]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ transform: 'translateZ(-10px)' }}
                      />
                      <Input
                        id="phone"
                        {...register("phone", { 
                          required: "Phone number is required",
                          pattern: {
                            value: /^[\+]?[1-9][\d]{0,15}$/,
                            message: "Invalid phone number"
                          }
                        })}
                        aria-required="true"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        className={commonInputClass}
                        placeholder="Enter your phone number"
                      />
                      {watchedPhone && watchedPhone.length >= 10 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500 drop-shadow-lg" />
                        </motion.div>
                      )}
                    </div>
                    {errors.phone && (
                      <motion.p 
                        id="phone-error"
                        className="text-sm text-destructive font-medium flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* City with 3D Input */}
                  <motion.div variants={fieldVariants} className="space-y-3 group">
                    <Label htmlFor="city" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#FF5733]" />
                      Preferred City <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-[#FF7849]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ transform: 'translateZ(-10px)' }}
                      />
                      <Input
                        id="city"
                        {...register("city", { 
                          required: "City is required",
                          minLength: { value: 2, message: "City must be at least 2 characters" }
                        })}
                        aria-required="true"
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? "city-error" : undefined}
                        className={commonInputClass}
                        placeholder="Enter your city"
                      />
                      {watchedCity && watchedCity.length >= 2 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500 drop-shadow-lg" />
                        </motion.div>
                      )}
                    </div>
                    {errors.city && (
                      <motion.p 
                        id="city-error"
                        className="text-sm text-destructive font-medium flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.city.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Budget with 3D Select */}
                  <motion.div variants={fieldVariants} className="space-y-3 group">
                    <Label htmlFor="budget" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#FF5733]" />
                      Investment Budget <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-[#FF5733]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ transform: 'translateZ(-10px)' }}
                      />
                      <Select
                        value={watchedBudget}
                        onValueChange={(value) => {
                          setValue("budget", value);
                        }}
                      >
                        <SelectTrigger aria-label="Select your budget range" className={commonInputClass}>
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
                          {budgetRanges.map((range) => (
                            <SelectItem 
                              key={range} 
                              value={range}
                              className="text-base py-3 rounded-lg text-gray-800 hover:bg-orange-50 transition-colors"
                            >
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.budget && (
                      <motion.p 
                        className="text-sm text-destructive font-medium flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.budget.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Industry with 3D Select */}
                  <motion.div variants={fieldVariants} className="space-y-3 group">
                    <Label htmlFor="industry" className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#FF5733]" />
                      Industry Preference <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-[#FF7849]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ transform: 'translateZ(-10px)' }}
                      />
                      <Select
                        value={watchedIndustry}
                        onValueChange={(value) => {
                          setValue("industry", value);
                        }}
                      >
                        <SelectTrigger aria-label="Select preferred industry" className={commonInputClass}>
                          <SelectValue placeholder="Select preferred industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
                          {industries.map((industry) => (
                            <SelectItem 
                              key={industry} 
                              value={industry}
                              className="text-base py-3 rounded-lg text-gray-800 hover:bg-orange-50 transition-colors"
                            >
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.industry && (
                      <motion.p 
                        className="text-sm text-destructive font-medium flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.industry.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Enhanced 3D CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  {/* 3D Button Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-xl transform translate-y-4"></div>
                  
                  <Button
                    type="submit"
                    className="relative w-full h-14 bg-gradient-to-r from-[#FF5733] to-[#FF7849] hover:from-[#ff6a4a] hover:to-[#ff8b63] transition-all duration-300 text-lg font-bold text-white rounded-2xl transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70 shadow-xl hover:shadow-2xl border-0 z-10"
                    disabled={isLoading || externalLoading || !isValid}
                  >
                    {isLoading || externalLoading ? (
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Generating Report...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Generate My Franchise ROI Report
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* Enhanced Security Note with 3D Effects */}
                <motion.div 
                  className="flex items-center justify-center text-sm text-gray-600 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span>
                    Your data is safe. We only use it to prepare your report.
                  </span>
                </motion.div>
              </motion.form>

              {/* Error Display */}
              {error && (
                <motion.div 
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 font-medium">Error: {error}</span>
                  </div>
                </motion.div>
              )}

              {/* Results Display */}
              {showResults && recommendations.length > 0 && (
                <motion.div 
                  className="mt-8 space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      🎉 Your Franchise Recommendations
                    </h3>
                    <p className="text-gray-600">
                      Found {recommendations.length} franchise opportunities matching your criteria
                    </p>
                  </div>

                  {/* Download PDF Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={generatePDF}
                      className="bg-gradient-to-r from-[#FF5733] to-[#FF7849] hover:from-[#ff6a4a] hover:to-[#ff8b63] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download ROI Report (PDF)
                    </Button>
                  </div>

                  {/* Recommendations Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((franchise, index) => (
                      <motion.div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#FF5733] to-[#FF7849] rounded-lg flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">{franchise.name}</h4>
                          </div>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {franchise.roi}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Investment:</span>
                            <span className="font-semibold text-gray-900">{franchise.investment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Break-even:</span>
                            <span className="font-semibold text-gray-900">{franchise.breakEven}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">City:</span>
                            <span className="font-semibold text-gray-900">{franchise.city}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 leading-relaxed">{franchise.notes}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Reset Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setRecommendations([]);
                        setUserData(null);
                        setError(null);
                        // Reset form
                        const form = document.querySelector('form');
                        if (form) form.reset();
                      }}
                      variant="outline"
                      className="border-[#FF5733] text-[#FF5733] hover:bg-[#FF5733] hover:text-white"
                    >
                      Generate New Report
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}