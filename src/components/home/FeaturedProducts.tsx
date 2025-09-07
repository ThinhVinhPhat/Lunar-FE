import ProductItem from "../product/ProductItem";
import { Product } from "@/shared/types/product";
import Text from "../../shared/components/wrapper/Text";
import { useProductAction } from "@/shared/hooks/useProductAction";

import {
  Box,
  Typography,
  Skeleton,
  Container,
  GlobalStyles,
} from "@mui/material";
import { useState } from "react";

const globalStyles = (
  <GlobalStyles
    styles={{
      '@keyframes shimmer': {
        '0%': {
          backgroundPosition: '-200% 0'
        },
        '100%': {
          backgroundPosition: '200% 0'
        }
      },
      '@keyframes fadeInUp': {
        '0%': {
          opacity: 0,
          transform: 'translateY(30px)'
        },
        '100%': {
          opacity: 1,
          transform: 'translateY(0)'
        }
      }
    }}
  />
);

const FeaturedProducts = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { products, isLoading, handleFavoriteProduct } = useProductAction();

  const mostViewedProducts = products
    ?.sort((a: Product, b: Product) => b.views - a.views)
    .slice(0, 4);

  return (
    <>
      {globalStyles}
      <Box 
        component="section" 
        sx={{ 
          width: "100%", 
          py: { xs: 6, md: 8 },
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #C8A846 50%, transparent 100%)',
          }
        }}
      >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: 'column',
            alignItems: "center",
            mb: { xs: 4, md: 6 },
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #C8A846 0%, #d4b852 50%, #e6c866 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 3,
              position: 'relative',
              textShadow: '0 2px 4px rgba(200, 168, 70, 0.1)',
              animation: 'fadeInUp 0.8s ease-out',
              '&::before': {
                content: '"✨"',
                position: 'absolute',
                left: '-40px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.5rem',
                animation: 'shimmer 2s infinite'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent 0%, #C8A846 20%, #d4b852 50%, #e6c866 80%, transparent 100%)',
                borderRadius: '2px',
                boxShadow: '0 2px 8px rgba(200, 168, 70, 0.3)'
              }
            }}
          >
            <Text id="home.shopOurMostPopularStyles" />
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '600px',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            <Text id="home.shopOurMostPopularStylesDescription" />
          </Typography>
        </Box>

        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: isLoading ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'
            },
            gap: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            justifyContent: 'center',
            '& > *': {
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                '& .MuiCard-root': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }
            }
          }}
        >
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <Box key={i} sx={{ width: '100%' }}>
                  <Skeleton 
                    variant="rectangular" 
                    height={280} 
                    sx={{ 
                      borderRadius: 3,
                      width: '100%',
                      aspectRatio: '1080/614',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }} 
                  />
                  <Box sx={{ pt: 2 }}>
                    <Skeleton height={28} sx={{ borderRadius: 1, mb: 1 }} />
                    <Skeleton width="70%" height={20} sx={{ borderRadius: 1, mb: 0.5 }} />
                    <Skeleton width="50%" height={20} sx={{ borderRadius: 1 }} />
                  </Box>
                </Box>
              ))
            : mostViewedProducts?.map((product: Product, index: number) => (
                <Box 
                  key={product.id}
                  sx={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <ProductItem
                    product={product}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    handleFavoriteProduct={handleFavoriteProduct}
                  />
                </Box>
              ))}
        </Box>
      </Container>
      </Box>
    </>
  );
};

export default FeaturedProducts;
