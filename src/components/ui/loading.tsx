import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "shimmer";
  text?: string;
  className?: string;
}

export function Loading({ 
  size = "md", 
  variant = "spinner", 
  text,
  className = "" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const renderSpinner = () => (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-primary rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-primary rounded-full`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const renderShimmer = () => (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-lg`}>
      <motion.div
        className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "shimmer":
        return renderShimmer();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        {renderVariant()}
        {variant === "spinner" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: -360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className={`${sizeClasses[size]} text-primary/30`} />
          </motion.div>
        )}
      </div>
      
      {text && (
        <motion.p
          className={`${textSizes[size]} text-muted-foreground font-medium text-center`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Specialized loading components
export function LoadingSpinner({ size = "md", text, className }: Omit<LoadingProps, "variant">) {
  return <Loading size={size} variant="spinner" text={text} className={className} />;
}

export function LoadingDots({ size = "md", text, className }: Omit<LoadingProps, "variant">) {
  return <Loading size={size} variant="dots" text={text} className={className} />;
}

export function LoadingPulse({ size = "md", text, className }: Omit<LoadingProps, "variant">) {
  return <Loading size={size} variant="pulse" text={text} className={className} />;
}

export function LoadingShimmer({ size = "md", text, className }: Omit<LoadingProps, "variant">) {
  return <Loading size={size} variant="shimmer" text={text} className={className} />;
}

// Full screen loading overlay
export function LoadingOverlay({ 
  text = "Loading...", 
  variant = "spinner",
  className = "" 
}: Omit<LoadingProps, "size">) {
  return (
    <motion.div
      className={`fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loading size="lg" variant={variant} text={text} />
    </motion.div>
  );
}
