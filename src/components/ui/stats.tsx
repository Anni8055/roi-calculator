import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatItemProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  className?: string;
}

interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export function StatItem({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  description,
  className = "" 
}: StatItemProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <motion.div
      className={`${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full border-0 shadow-soft hover:shadow-card transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                {trend && trendValue && (
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-medium ${getTrendColor()}`}>
                      {getTrendIcon()} {trendValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {trend && (
              <Badge 
                variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
                className="text-xs"
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsGrid({ children, className = "" }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}

// Specialized stat components
export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  description,
  className 
}: StatItemProps) {
  return (
    <StatItem
      title={title}
      value={value}
      icon={icon}
      trend={trend}
      trendValue={trendValue}
      description={description}
      className={className}
    />
  );
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  description,
  className 
}: StatItemProps) {
  return (
    <StatItem
      title={title}
      value={value}
      icon={icon}
      trend={trend}
      trendValue={trendValue}
      description={description}
      className={className}
    />
  );
}
