import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { Download, Mail, TrendingUp, Clock, DollarSign, Building, Users, Target, ArrowRight, BarChart3, Award } from "lucide-react";
import { Franchise } from "@/data/franchiseData";
import { FormData } from "./FranchiseForm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { StatsGrid, StatCard } from "@/components/ui/stats";

interface FranchiseReportProps {
  formData: FormData;
  franchises: Franchise[];
  onReset: () => void;
}

export function FranchiseReport({ formData, franchises, onReset }: FranchiseReportProps) {
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = React.useState<number>(1000000);
  const [interestRate, setInterestRate] = React.useState<number>(8);
  const [tenureYears, setTenureYears] = React.useState<number>(5);

  const downloadPDF = async () => {
    const reportElement = document.getElementById('franchise-report');
    if (!reportElement) return;

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`franchise-report-${formData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your franchise report has been downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendEmail = () => {
    // Simulate email sending (in real app, this would make an API call)
    toast({
      title: "Email Sent",
      description: `Report has been sent to ${formData.email}`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate summary statistics
  const totalInvestment = franchises.reduce((sum, franchise) => {
    const investment = franchise.investment.replace(/[^\d]/g, '');
    return sum + parseInt(investment || '0');
  }, 0);

  const avgROI = franchises.reduce((sum, franchise) => {
    const roi = parseFloat(franchise.roi_percent.replace('%', ''));
    return sum + roi;
  }, 0) / franchises.length;

  const avgBreakEven = franchises.reduce((sum, franchise) => {
    const years = parseFloat(franchise.break_even.replace(/[^\d.]/g, ''));
    return sum + years;
  }, 0) / franchises.length;

  // EMI-style calculations (for visual parity with provided screenshot)
  const principal = loanAmount;
  const monthlyRate = interestRate / 12 / 100;
  const numMonths = tenureYears * 12;
  const emi = monthlyRate === 0
    ? principal / numMonths
    : (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1);
  const totalPayment = emi * numMonths;
  const totalInterest = Math.max(totalPayment - principal, 0);

  const pieData = [
    { name: 'Principal', value: principal, color: 'hsl(var(--primary))' },
    { name: 'Interest', value: totalInterest, color: 'hsl(var(--accent))' }
  ];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card id="franchise-report" className="shadow-elegant border-0 bg-card overflow-hidden">
        {/* Hero with pill actions */}
        <CardHeader className="text-center pb-6 bg-gradient-subtle relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <motion.div 
            className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center relative z-10"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
              Smarter Franchise Finance Planner
            </CardTitle>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <Button variant="secondary" className="rounded-full px-4">
                ₹ Calculate Monthly Payments
              </Button>
              <Button variant="secondary" className="rounded-full px-4">
                ● Visual Payment Breakdown
              </Button>
              <Button variant="secondary" className="rounded-full px-4">
                ☎ Mobile-Friendly
              </Button>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {franchises.length > 0 ? (
            <motion.div className="space-y-8" variants={containerVariants}>
              {/* 3-column EMI-style layout */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Parameters */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Loan Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Loan Amount (₹)</span>
                        <span className="font-semibold">₹{loanAmount.toLocaleString()}</span>
                      </div>
                      <Slider
                        value={[loanAmount]}
                        min={100000}
                        max={10000000}
                        step={10000}
                        onValueChange={(v) => setLoanAmount(v[0])}
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>1L</span><span>50L</span><span>1Cr</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Interest Rate (%)</span>
                        <span className="font-semibold">{interestRate.toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[interestRate]}
                        min={1}
                        max={20}
                        step={0.1}
                        onValueChange={(v) => setInterestRate(v[0])}
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>1%</span><span>10%</span><span>20%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Loan Tenure (Years)</span>
                        <span className="font-semibold">{tenureYears} Years</span>
                      </div>
                      <Slider
                        value={[tenureYears]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(v) => setTenureYears(v[0])}
                      />
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                        <span>1Yr</span><span>15Yrs</span><span>30Yrs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Center: Donut chart */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={2}>
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Summary */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border p-4">
                      <div className="text-xs text-muted-foreground mb-1">Monthly EMI</div>
                      <div className="text-2xl font-bold">₹{emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    </div>
                    <div className="rounded-xl border p-4">
                      <div className="text-xs text-muted-foreground mb-1">Total Interest</div>
                      <div className="text-xl font-semibold">₹{Math.round(totalInterest).toLocaleString()}</div>
                      <div className="text-[11px] text-muted-foreground">{((totalInterest / principal) * 100).toFixed(1)}% of loan amount</div>
                    </div>
                    <div className="rounded-xl border p-4">
                      <div className="text-xs text-muted-foreground mb-1">Total Payment</div>
                      <div className="text-xl font-semibold">₹{Math.round(totalPayment).toLocaleString()}</div>
                      <div className="text-[11px] text-muted-foreground">Principal + Interest</div>
                    </div>
                    <Button className="w-full">Apply for Loan</Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Existing Investment Summary retains below */}
              {/* Summary Statistics */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground mb-6 text-center">
                  📊 Investment Summary
                </h3>
                <StatsGrid>
                  <StatCard
                    title="Total Investment Range"
                    value={`₹${totalInvestment} Lakh+`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="High Potential"
                    description="Combined investment range for all recommended franchises"
                  />
                  <StatCard
                    title="Average ROI"
                    value={`${avgROI.toFixed(1)}%`}
                    icon={BarChart3}
                    trend="up"
                    trendValue="Above Market"
                    description="Average return on investment across all franchises"
                  />
                  <StatCard
                    title="Average Break-even"
                    value={`${avgBreakEven.toFixed(1)} years`}
                    icon={Clock}
                    trend="neutral"
                    trendValue="Standard"
                    description="Typical time to recover your investment"
                  />
                </StatsGrid>
              </motion.div>

              <Separator />

              <motion.div className="text-center" variants={itemVariants}>
                <h3 className="text-xl md:text-2xl font-semibold text-card-foreground mb-2">
                  🏆 Top {franchises.length} Recommended Franchises
                </h3>
                <p className="text-muted-foreground">
                  Based on your budget and industry preference
                </p>
              </motion.div>

              {/* Enhanced Franchise Cards for Mobile */}
              <div className="block md:hidden space-y-4">
                {franchises.slice(0, 3).map((franchise, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-gradient-subtle rounded-xl p-4 border border-border/50 relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Ranking Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs font-bold">
                        #{index + 1}
                      </Badge>
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-card-foreground">{franchise.brand}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gradient-accent text-accent-foreground">
                        {franchise.roi_percent}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Investment:</span>
                        <span className="font-medium text-card-foreground">{franchise.investment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Break-even:</span>
                        <span className="font-medium text-card-foreground">{franchise.break_even}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      {franchise.notes}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Table for Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <motion.table 
                  className="w-full border-collapse"
                  variants={itemVariants}
                >
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left py-4 px-4 font-semibold text-card-foreground">Rank</th>
                      <th className="text-left py-4 px-4 font-semibold text-card-foreground">Brand</th>
                      <th className="text-left py-4 px-4 font-semibold text-card-foreground">Investment</th>
                      <th className="text-left py-4 px-4 font-semibold text-card-foreground">ROI %</th>
                      <th className="text-left py-4 px-4 font-semibold text-card-foreground">Break-even</th>
                      <th className="text-left py-4 px-4 font-semibold text-card-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {franchises.slice(0, 3).map((franchise, index) => (
                      <motion.tr 
                        key={index} 
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                        variants={itemVariants}
                        whileHover={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
                      >
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="text-xs font-bold">
                            #{index + 1}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <Award className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-medium text-card-foreground">{franchise.brand}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-card-foreground">{franchise.investment}</td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="bg-gradient-accent text-accent-foreground">
                            {franchise.roi_percent}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-card-foreground">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {franchise.break_even}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground max-w-xs">
                          {franchise.notes}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              </div>

              <Separator />

              {/* Enhanced CTA Section */}
              <motion.div 
                className="bg-gradient-subtle p-6 md:p-8 rounded-xl text-center relative overflow-hidden"
                variants={itemVariants}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <h4 className="text-lg md:text-xl font-semibold text-card-foreground">
                      👉 Want detailed consultation?
                    </h4>
                  </div>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Book a free call with Untapped India experts to discuss these opportunities in detail.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="default" 
                      className="bg-gradient-accent hover:shadow-glow transition-all duration-300 group"
                    >
                      Book Free Consultation Call
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                No Matching Franchises Found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find franchises matching your specific criteria. Try adjusting your budget or industry preference.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={onReset} variant="outline">
                  Modify Search Criteria
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Action Buttons */}
      {franchises.length > 0 && (
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={downloadPDF}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={sendEmail}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Report
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={onReset} variant="secondary" className="w-full sm:w-auto">
              Generate New Report
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}