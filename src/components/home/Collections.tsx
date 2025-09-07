import { useNavigate } from "react-router-dom";
import { useGetCategoriesDetailByCateName } from "@/lib/hooks/queryClient/query/category/category.query";
import { CategoryDetail } from "@/shared/types/category";
import Text from "../../shared/components/wrapper/Text";
import { useAutoPlaySlider } from "@/shared/hooks/useAutoPlaySlider";
import IsLoadingWrapper from "../../shared/components/wrapper/isLoading";

import {
  Box,
  Typography,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";



const Collections = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategoriesDetailByCateName("Material");

  const itemsPerSlide = 3;
  const maxSteps = categories ? Math.ceil(categories.length / itemsPerSlide) : 0;
  
  const {
    activeIndex: activeStep,
    setActiveIndex: setActiveStep,
    nextSlide,
    prevSlide,
    handleMouseEnter,
    handleMouseLeave,
  } = useAutoPlaySlider({
    totalSlides: maxSteps,
    interval: 4000,
    enableMouseEvents: true,
  });

  const getSlideItems = (slideIndex: number) => {
    if (!categories || categories.length === 0) return [];
    const startIndex = slideIndex * itemsPerSlide;
    const items = categories.slice(startIndex, startIndex + itemsPerSlide);
    return items;
  };

  return (
    <Box 
      sx={{ position: "relative", py: 4 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <IsLoadingWrapper isLoading={isLoadingCategories}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            p: 2,
            width: "100%",
          }}
        >
          {getSlideItems(activeStep)?.map(
            (category: CategoryDetail, index: number) => {
              const image = category?.image?.[0].replace(/[{}"]/g, "");
              return (
                <Card
                  key={`${category.id}-${activeStep}-${index}`}
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": { transform: "translateY(-8px)" },
                      }}
                      onClick={() => navigate(`/collections/${category.name}`)}
                    >
                      <Box sx={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          image={image}
                          alt={category.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.7s ease-in-out",
                            "&:hover": { transform: "scale(1.05)" },
                          }}
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            bgcolor: "#C8A846",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                          }}
                        >
                          {category.name}
                        </Box>

                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                            opacity: 0,
                            transition: "opacity 0.3s ease-in-out",
                            "&:hover": { opacity: 1 },
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 3,
                          color: "white",
                          transform: "translateY(100%)",
                          transition: "transform 0.3s ease-in-out",
                          ".MuiCard-root:hover &": { transform: "translateY(0)" },
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold" mb={1}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0, ".MuiCard-root:hover &": { opacity: 1 }, transition: "opacity 0.3s ease-in-out 0.1s" }}>
                          {category.description}
                        </Typography>

                        <Button
                          variant="contained"
                          sx={{
                            mt: 2,
                            px: 3,
                            py: 1,
                            bgcolor: "#C8A846",
                            color: "white",
                            borderRadius: 1,
                            "&:hover": { bgcolor: "#b69339" },
                            opacity: 0,
                            transform: "translateY(16px)",
                            transition: "all 0.3s ease-in-out 0.15s",
                            ".MuiCard-root:hover &": { opacity: 1, transform: "translateY(0)" },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/collections/${category.name}`);
                          }}
                        >
                          <Text id="collections.exploreCollection" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                }
                )}
        </Box>

        {maxSteps > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: "absolute",
                left: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                color: "#333",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
                transition: "all 0.3s ease",
                "&:hover": { 
                  bgcolor: "white",
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed"
                }
              }}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </IconButton>

            <IconButton
              onClick={nextSlide}
              sx={{
                position: "absolute",
                right: { xs: 8, md: 16 },
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                color: "#333",
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
                transition: "all 0.3s ease",
                "&:hover": { 
                  bgcolor: "white",
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed"
                }
              }}
              disabled={activeStep === maxSteps - 1}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </IconButton>

            {/* Dots Indicator */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 4,
                pb: 2
              }}
            >
              {Array.from({ length: maxSteps }).map((_, index) => (
                <Box
                  key={index}
                  component="button"
                  onClick={() => setActiveStep(index)}
                  sx={{
                    width: activeStep === index ? 32 : 12,
                    height: 12,
                    borderRadius: 6,
                    border: "none",
                    bgcolor: activeStep === index ? "#C8A846" : "rgba(200, 168, 70, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: activeStep === index ? "#b69339" : "rgba(200, 168, 70, 0.5)"
                    }
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </Box>
          </>
        )}
      </IsLoadingWrapper>
    </Box>
  );
};

export default Collections;


