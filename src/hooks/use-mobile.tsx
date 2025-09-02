import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Set initial size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  const isBreakpoint = (breakpoint: keyof typeof breakpoints) => {
    return screenSize.width >= breakpoints[breakpoint];
  };

  const isBelowBreakpoint = (breakpoint: keyof typeof breakpoints) => {
    return screenSize.width < breakpoints[breakpoint];
  };

  const isBetweenBreakpoints = (min: keyof typeof breakpoints, max: keyof typeof breakpoints) => {
    return screenSize.width >= breakpoints[min] && screenSize.width < breakpoints[max];
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    isBreakpoint,
    isBelowBreakpoint,
    isBetweenBreakpoints,
    breakpoints,
  };
}
