import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useGetCategoriesDetailByCateName } from "@/lib/hooks/queryClient/query/category/category.query";
import { CategoryDetail } from "@/types/category";
import Text from "../wrapper/Text";
import IsLoadingWrapper from "../wrapper/isLoading";
import { Box, Typography, IconButton, Button, Chip } from "@mui/material";

const Collections = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesDetailByCateName("Material");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const itemsPerSlide = 3;
  const totalSlides = categories
    ? Math.ceil(categories.length / itemsPerSlide)
    : 0;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  useEffect(() => {
    if (autoplay && totalSlides > 1) {
      autoplayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, currentSlide, totalSlides]);

  const handleMouseEnter = () => {
    setAutoplay(false);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const handleMouseLeave = () => {
    setAutoplay(true);
  };

  const getSlideItems = (slideIndex: number) => {
    if (!categories || categories.length === 0) return [];

    const startIndex = slideIndex * itemsPerSlide;
    let items = categories.slice(startIndex, startIndex + itemsPerSlide);

    if (items.length < itemsPerSlide) {
      const remainingCount = itemsPerSlide - items.length;
      const loopedItems = categories.slice(0, remainingCount);
      items = [...items, ...loopedItems];
    }

    return items;
  };

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <IsLoadingWrapper isLoading={isLoadingCategories}>
        <>
          <Box sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                transition: 'transform 500ms ease-in-out',
                transform: `translateX(-${currentSlide}%)`
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
  <Box
    key={slideIndex}
    sx={{
      minWidth: '100%',
      display: slideIndex === currentSlide ? 'flex' : 'none',
      gap: 6,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}
  >
    {getSlideItems(slideIndex)?.map((category: CategoryDetail, index: number) => {
      const image = category?.image?.map((item: string) =>
        item.replace(/[{}"]/g, "")
      );

      return (
        <Box
          key={`${category.id}-${slideIndex}-${index}`}
          sx={{
            flex: '1 1 calc(33.333% - 32px)', // 3 cột
            maxWidth: 'calc(33.333% - 32px)',
            minWidth: '250px'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 500ms',
              '&:hover': {
                transform: 'translateY(-8px)'
              },
              '&:hover .overlay': {
                opacity: 1
              },
              '&:hover .content': {
                transform: 'translateY(0)'
              },
              '&:hover .description': {
                opacity: 1
              },
              '&:hover .button': {
                opacity: 1,
                transform: 'translateY(0)'
              },
              '&:hover .image': {
                transform: 'scale(1.05)'
              }
            }}
            onClick={() => navigate(`/collections/${category.name}`)}
          >
            <Box sx={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
              <Box
                component="img"
                src={image?.length > 1 ? image[1] : image?.[0] || ""}
                alt={category.name}
                className="image"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 700ms'
                }}
              />

              <Chip
                label={category.name}
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  bgcolor: '#C8A846',
                  color: 'white',
                  fontSize: '0.75rem'
                }}
              />

              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  opacity: 0,
                  transition: 'opacity 300ms'
                }}
              />
            </Box>

            <Box
              className="content"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 6,
                color: 'white',
                transform: 'translateY(24px)',
                transition: 'transform 300ms'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  mb: 2
                }}
              >
                {category.name}
              </Typography>
              <Typography
                className="description"
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  opacity: 0,
                  transition: 'opacity 300ms',
                  transitionDelay: '100ms'
                }}
              >
                {category.description}
              </Typography>

              <Button
                className="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/collections/${category.name}`);
                }}
                sx={{
                  mt: 4,
                  px: 6,
                  py: 2,
                  bgcolor: '#C8A846',
                  color: 'white',
                  borderRadius: 1,
                  opacity: 0,
                  transform: 'translateY(16px)',
                  transition: 'all 300ms',
                  transitionDelay: '150ms',
                  '&:hover': {
                    bgcolor: '#b69339'
                  }
                }}
              >
                <Text id="collections.exploreCollection" />
              </Button>
            </Box>
          </Box>
        </Box>
      );
    })}
  </Box>
))}

            </Box>
          </Box>

          {totalSlides > 1 && (
            <>
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  color: 'gray.800',
                  boxShadow: 2,
                  zIndex: 10,
                  transition: 'all 300ms',
                  '&:hover': {
                    bgcolor: 'white'
                  }
                }}
                aria-label="Previous slide"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </IconButton>
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translate(50%, -50%)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  color: 'gray.800',
                  boxShadow: 2,
                  zIndex: 10,
                  transition: 'all 300ms',
                  '&:hover': {
                    bgcolor: 'white'
                  }
                }}
                aria-label="Next slide"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </IconButton>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 2 }}>
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => setCurrentSlide(index)}
                    sx={{
                      width: currentSlide === index ? 24 : 12,
                      height: 12,
                      borderRadius: '50%',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 300ms',
                      bgcolor: currentSlide === index ? '#C8A846' : '#d1d5db',
                      '&:hover': {
                        bgcolor: currentSlide === index ? '#C8A846' : '#9ca3af'
                      }
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </Box>
            </>
          )}
        </>
      </IsLoadingWrapper>
    </Box>
  );
};

export default Collections;
