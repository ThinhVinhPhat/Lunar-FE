import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Box } from '@mui/material';

interface AutoPlaySwipeableViewsProps {
  children: ReactNode[];
  axis?: 'x' | 'x-reverse';
  index?: number;
  onChangeIndex?: (index: number) => void;
  enableMouseEvents?: boolean;
  interval?: number;
  animateHeight?: boolean;
  animateTransitions?: boolean;
  disabled?: boolean;
  hysteresis?: number;
  resistance?: boolean;
  slideStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

const AutoPlaySwipeableViews: React.FC<AutoPlaySwipeableViewsProps> = ({
  children,
  axis = 'x',
  index = 0,
  onChangeIndex,
  enableMouseEvents = true,
  interval = 3000,
  animateTransitions = true,
  disabled = false,
  slideStyle = {},
  containerStyle = {},
}) => {
  const [activeIndex, setActiveIndex] = useState(index);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = React.Children.count(children);

  // Update internal index when external index changes
  useEffect(() => {
    setActiveIndex(index);
  }, [index]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !disabled && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % totalSlides;
        setActiveIndex(nextIndex);
        onChangeIndex?.(nextIndex);
      }, interval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isAutoPlaying, activeIndex, totalSlides, interval, disabled, onChangeIndex]);

  // Handle manual index changes
  // const handleIndexChange = (newIndex: number) => {
  //   setActiveIndex(newIndex);
  //   onChangeIndex?.(newIndex);
    
  //   // Temporarily pause auto-play
  //   if (autoPlayRef.current) {
  //     clearInterval(autoPlayRef.current);
  //     autoPlayRef.current = null;
  //   }
    
  //   // Resume auto-play after a delay
  //   setTimeout(() => {
  //     setIsAutoPlaying(true);
  //   }, 1000);
  // };

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

  // Calculate transform based on axis and index
  const getTransform = () => {
    const translateValue = -activeIndex * 100;
    
    switch (axis) {
      case 'x-reverse':
        return `translateX(${translateValue}%)`;
      case 'x':
      default:
        return `translateX(${translateValue}%)`;
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        ...containerStyle,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        sx={{
          display: 'flex',
          width: `${totalSlides * 100}%`,
          height: '100%',
          transform: getTransform(),
          transition: animateTransitions ? 'transform 0.5s ease-in-out' : 'none',
          ...(axis === 'x-reverse' && { flexDirection: 'row-reverse' }),
        }}
      >
        {React.Children.map(children, (child, childIndex) => (
          <Box
            key={childIndex}
            sx={{
              width: '100%',
              height: '100%',
              flexShrink: 0,
              position: 'relative',
              ...slideStyle,
            }}
          >
            {child}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AutoPlaySwipeableViews;
