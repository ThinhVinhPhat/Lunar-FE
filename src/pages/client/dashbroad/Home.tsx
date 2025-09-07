import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Collections from "@/components/home/Collections";
import Reviews from "@/components/home/Reviews";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import Text from "@/shared/components/wrapper/Text";
import Banner from "@/components/home/Banner";
import { Box, Container, Typography } from "@mui/material";

const Home = () => {
  const [query] = useSearchParams();

  useEffect(() => {
    try {
      if (query.get("token")) {
        Cookies.set("accessToken", query.get("token") || "");
        if (query.get("refreshToken")) {
          Cookies.set("refreshToken", query.get("refreshToken") || "");
        }
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  }, [query]);

  return (
    <Box component="main" sx={{ bgcolor: 'white' }}>
      <Hero />

      <Box sx={{ py: 10, bgcolor: 'white' }}>
  <Container maxWidth="xl">
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
              background: 'linear-gradient(135deg, #2c2c2c 0%, #4a4a4a 50%, #6b6b6b 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              mb: 3,
              position: 'relative',
              textShadow: '0 4px 8px rgba(44, 44, 44, 0.1)',
              '&::before': {
                content: '"🔥"',
                position: 'absolute',
                left: '-50px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '2rem',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '5px',
                background: 'linear-gradient(90deg, transparent 0%, #C8A846 10%, #d4b852 30%, #e6c866 50%, #d4b852 70%, #C8A846 90%, transparent 100%)',
                borderRadius: '3px',
                boxShadow: '0 3px 12px rgba(200, 168, 70, 0.4)',
                animation: 'shimmer 3s infinite'
              }
            }}
          >
          <Text id="home.ourCollections" />
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
              <Text id="home.explore" />
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
          <Text id="home.exploreMaterials" />
          </Typography>
        </Box>
          <Collections />
        </Container>
      </Box>
              


      <Box sx={{ position: 'relative', py: 10, bgcolor: 'var(--primary-color)', color: 'white' }}>
        <Banner />
      </Box>

      <Box sx={{ mb: 10, bgcolor: 'var(--primary-color)', color: 'white' }}>
        <Container maxWidth={false} sx={{ px: 4 }}>
          <FeaturedProducts />
        </Container>
      </Box>

      <Box sx={{ py: 5, bgcolor: '#f7f7f7' }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={2}>
            <Typography 
              variant="overline" 
              sx={{ 
                color: '#C8A846', 
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                display: 'block',
                mb: 2
              }}
            >
              <Text id="home.testimonials" />
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold', 
                color: '#2c2c2c'
              }}
            >
              <Text id="home.whatCustomersSay" />
            </Typography>
            <Typography sx={{ color: '#6b6b6b', mt: 2 }}>
              <Text id="home.realReviews" />{" "}
              <Typography component="span" sx={{ color: '#C8A846' }}>★★★★★</Typography>
            </Typography>
          </Box>
          <Reviews />
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
