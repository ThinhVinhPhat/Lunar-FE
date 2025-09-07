import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Text from "../../shared/components/wrapper/Text";
import { Button } from "../../shared/components/Button";
import { useState, useRef, useEffect } from "react";
import { heroSlides } from "@/database/home";
import { Box, Typography, IconButton } from "@mui/material";
import { useAutoPlaySlider } from "../../shared/hooks/useAutoPlaySlider";

const Hero = () => {
  const [isInView, setIsInView] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const heroRef = useRef(null);

  const totalSlides = heroSlides.length;
  
  const {
    activeIndex: currentSlide,
    setActiveIndex: setCurrentSlide,
    nextSlide,
    prevSlide,
    handleMouseEnter: autoPlayMouseEnter,
    handleMouseLeave: autoPlayMouseLeave,
  } = useAutoPlaySlider({
    totalSlides,
    interval: 5000,
    enableMouseEvents: true,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          const timer = setTimeout(() => setTextVisible(true), 500);
          return () => clearTimeout(timer);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, [isInView]);


  useEffect(() => {
    setTextVisible(false);
    const timer = setTimeout(() => setTextVisible(true), 200);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <Box
      ref={heroRef}
      component="section"
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden'
      }}
      onMouseEnter={autoPlayMouseEnter}
      onMouseLeave={autoPlayMouseLeave}
    >
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {heroSlides.map((slide, index) => (
          <Box
            key={slide.id}
            sx={{
              position: 'absolute',
              inset: 0,
              transition: 'all 1000ms ease-in-out',
              opacity: index === currentSlide ? 1 : 0,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)'
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <Box
                component="img"
                src={slide.image}
                alt={`Hero slide ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 8000ms ease-out',
                  transform: index === currentSlide && isInView ? 'scale(1.1)' : 'scale(1)'
                }}
              />
            </Box>

            <Box 
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.5))'
              }}
            />

            <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
              {[...Array(15)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    bgcolor: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                    transition: 'all 3000ms',
                    opacity: index === currentSlide && isInView ? 1 : 0,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </Box>

            <Box 
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Box sx={{ textAlign: 'center', maxWidth: '64rem', px: 4 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3.75rem', md: '4.5rem' },
                    fontWeight: 'bold',
                    mb: 6,
                    transition: 'all 1000ms',
                    transform: index === currentSlide && textVisible 
                      ? 'translateY(0)' : 'translateY(2rem)',
                    opacity: index === currentSlide && textVisible ? 1 : 0
                  }}
                >
                  <Box component="span" sx={{ display: 'inline-block' }}>
                    <Text id={slide.title} />
                  </Box>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    mb: 8,
                    transition: 'all 1000ms',
                    transitionDelay: '0.3s',
                    transform: index === currentSlide && textVisible 
                      ? 'translateY(0)' : 'translateY(2rem)',
                    opacity: index === currentSlide && textVisible ? 1 : 0
                  }}
                >
                  <Text id={slide.subtitle} />
                </Typography>

                <Box
                  sx={{
                    transition: 'all 1000ms',
                    transitionDelay: '0.6s',
                    transform: index === currentSlide && textVisible 
                      ? 'translateY(0)' : 'translateY(2rem)',
                    opacity: index === currentSlide && textVisible ? 1 : 0
                  }}
                >
                  <Button
                    href={slide.buttonLink}
                    variant="secondary"
                    size="medium"
                  >
                    <Text id={slide.buttonText} />
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box 
              sx={{
                position: 'absolute',
                top: '25%',
                left: 40,
                width: 128,
                height: 4,
                bgcolor: 'rgba(255,255,255,0.3)'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  bgcolor: 'white',
                  transition: 'all 1500ms',
                  transitionDelay: '0.8s',
                  width: index === currentSlide && textVisible ? '100%' : 0
                }}
              />
            </Box>

            <Box 
              sx={{
                position: 'absolute',
                bottom: '25%',
                right: 40,
                width: 128,
                height: 4,
                bgcolor: 'rgba(255,255,255,0.3)'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  bgcolor: 'white',
                  transition: 'all 1500ms',
                  transitionDelay: '1s',
                  width: index === currentSlide && textVisible ? '100%' : 0
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {totalSlides > 1 && (
        <>
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: { xs: 16, md: 32 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              boxShadow: 3,
              zIndex: 10,
              transition: 'all 300ms',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.4)',
                transform: 'translateY(-50%) scale(1.1)'
              }
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </IconButton>
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: { xs: 16, md: 32 },
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              boxShadow: 3,
              zIndex: 10,
              transition: 'all 300ms',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.4)',
                transform: 'translateY(-50%) scale(1.1)'
              }
            }}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </IconButton>
        </>
      )}

      {totalSlides > 1 && (
        <Box 
          sx={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 3,
            zIndex: 10
          }}
        >
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              component="button"
              onClick={() => setCurrentSlide(index)}
              sx={{
                transition: 'all 300ms',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                width: currentSlide === index ? 32 : 12,
                height: 12,
                '&:hover': {
                  bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.7)'
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Box>
      )}

      <Typography
        sx={{
          position: 'absolute',
          top: 32,
          right: 32,
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.875rem',
          fontWeight: 'medium',
          zIndex: 10
        }}
      >
        {currentSlide + 1} / {totalSlides}
      </Typography>

      <style>{`
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </Box>
  );
};

export default Hero;
