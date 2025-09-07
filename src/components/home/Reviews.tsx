import {
  Box,
  Typography,
  Avatar,
  Rating,
  IconButton,
  useTheme,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useAutoPlaySlider } from "@/shared/hooks/useAutoPlaySlider";
import { reviews } from "@/database/reviews";


const Reviews = () => {
  const theme = useTheme();

  const {
    activeIndex,
    setActiveIndex,
    nextSlide,
    prevSlide,
    handleMouseEnter,
    handleMouseLeave,
  } = useAutoPlaySlider({
    totalSlides: reviews.length,
    interval: 5000,
    enableMouseEvents: true,
  });

  return (
    <Box 
      sx={{ 
        mx: "auto", 
        py: 2, 
        position: "relative"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box sx={{ p: 2, minHeight: 400, minWidth: 500 }}>
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ position: "relative", display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <Avatar
              src={reviews[activeIndex]?.avatar}
              alt={reviews[activeIndex]?.author}
              sx={{
                width: { xs: 150, md: 150 },
                height: { xs: 150, md: 150 },
                mx: "auto",
                mb: 3,
                border: "4px solid #C8A846",
              }}
            />
          </Box>

          <Rating value={reviews[activeIndex]?.rating} readOnly sx={{ mb: 2 }} />

          <Typography 
            variant="h6" 
            fontStyle="italic" 
            color="text.secondary" 
            mb={1} 
            px={2}
            sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            "{reviews[activeIndex]?.text}"
          </Typography>

          <Box>
            <Typography 
              variant="h5" 
              fontWeight="semibold" 
              color="#2c2c2c"
              sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              {reviews[activeIndex]?.author}
            </Typography>
            <Typography variant="subtitle1" color="primary.main" fontWeight="medium">
              {reviews[activeIndex]?.product}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {reviews[activeIndex]?.date}
            </Typography>
          </Box>
        </Box>
      </Box>

      {reviews.length > 1 && (
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
            disabled={activeIndex === 0}
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
            disabled={activeIndex === reviews.length - 1}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </IconButton>
        </>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
        {reviews.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: activeIndex === index ? 24 : 8,
              height: 8,
              borderRadius: activeIndex === index ? "8px" : "50%",
              bgcolor: activeIndex === index ? "#C8A846" : "#e0e0e0",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: activeIndex === index ? "#C8A846" : "#bdbdbd",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Reviews;
