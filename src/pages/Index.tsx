import { useState, useEffect } from "react";
import { FranchiseForm } from "@/components/FranchiseForm";
import { motion } from "framer-motion";

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-bg relative">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 py-8 relative"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        <FranchiseForm />
      </motion.div>
    </div>
  );
};

export default Index;