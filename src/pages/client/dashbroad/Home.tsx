import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Collections from "@/components/home/Collections";
import Reviews from "@/components/home/Reviews";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import Text from "@/components/wrapper/Text";
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
          <Box textAlign="center" mb={6}>
            <Typography
              variant="overline"
              sx={{
                color: '#C8A846',
                fontSize: '1.1rem',
                letterSpacing: '0.12em',
                display: 'block',
                fontWeight: 600,
                mb: 2,
              }}
            >
              <Text id="home.explore" />
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                mb: 3,
                color: '#2c2c2c',
              }}
            >
              <Text id="home.ourCollections" />
            </Typography>
            <Typography
              sx={{
                color: '#6b6b6b',
                maxWidth: '600px',
                mx: 'auto',
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

      <Box sx={{ py: 24, bgcolor: '#f7f7f7' }}>
        <Container maxWidth="xl">
          <Box textAlign="center" mb={16}>
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
                mb: 4, 
                color: '#2c2c2c' 
              }}
            >
              <Text id="home.whatCustomersSay" />
            </Typography>
            <Typography sx={{ color: '#6b6b6b' }}>
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
