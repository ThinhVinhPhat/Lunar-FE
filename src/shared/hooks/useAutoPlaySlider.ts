import { useState, useEffect, useRef } from 'react';

interface UseAutoPlaySliderProps {
  totalSlides: number;
  interval?: number;
  enableMouseEvents?: boolean;
  disabled?: boolean;
  initialIndex?: number;
}

interface UseAutoPlaySliderReturn {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  pauseAutoPlay: () => void;
  resumeAutoPlay: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export const useAutoPlaySlider = ({
  totalSlides,
  interval = 5000,
  enableMouseEvents = true,
  disabled = false,
  initialIndex = 0,
}: UseAutoPlaySliderProps): UseAutoPlaySliderReturn => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !disabled && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, interval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isAutoPlaying, totalSlides, interval, disabled]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    
    // Temporarily pause auto-play
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    
    // Resume auto-play after a delay
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 1000);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    
    // Temporarily pause auto-play
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    
    // Resume auto-play after a delay
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 1000);
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
  };

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  // Mouse event handlers
  const handleMouseEnter = () => {
    if (enableMouseEvents) {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (enableMouseEvents) {
      setIsAutoPlaying(true);
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    nextSlide,
    prevSlide,
    pauseAutoPlay,
    resumeAutoPlay,
    handleMouseEnter,
    handleMouseLeave,
  };
};
