import Text from "../../shared/components/wrapper/Text";
import { Button } from "../../shared/components/Button";
import { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

export default function Banner() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          const timer1 = setTimeout(() => setIsLoaded(true), 100);
          const timer2 = setTimeout(() => setTextVisible(true), 800);

          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
          };
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, [isInView]);

  return (
    <Box ref={bannerRef} sx={{ position: "relative", textAlign: "center", mb: 8, overflow: "hidden" }}>
      <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", overflow: "hidden" }}>
        <Box
          component="img"
          src="https://shwoodshop.com/cdn/shop/files/Experiment-Desktop.jpg?v=1736452704&width=1920"
          alt="Experimenting Everyday"
          sx={{
            width: "100rem",
            height: "40rem",
            objectFit: "cover",
            transition: "transform 3000ms ease-out",
            transform: isLoaded ? "scale(1.1)" : "scale(1)",
          }}
        />

        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 80%)" }} />

        <Box sx={{ position: "absolute", inset: 0, opacity: 0.2 }}>
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                width: 8,
                height: 8,
                bgcolor: "white",
                borderRadius: "50%",
                animation: `pulse-animation 2s infinite ${Math.random() * 2}s`,
                transition: "opacity 2000ms",
                opacity: isLoaded ? 1 : 0,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ position: "absolute", top: "50%", left: 0, width: "100%", transform: "translateY(-50%)" }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#f1efef",
            transition: "all 1000ms",
            transform: textVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.9)",
            opacity: textVisible ? 1 : 0,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-block",
              transition: "all 700ms",
              transform: textVisible ? "translateY(0)" : "translateY(16px)",
              opacity: textVisible ? 1 : 0,
              transitionDelay: "0.2s",
            }}
          >
            <Text id="home.experimentingEveryday" />
          </Box>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "50%", mx: "auto" }}>
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              mb: 4,
              textAlign: "left",
              ml: 5,
              transition: "all 1000ms",
              transform: textVisible ? "translateY(0)" : "translateY(32px)",
              opacity: textVisible ? 1 : 0,
              transitionDelay: "0.6s",
            }}
          >
            <Text id="home.boundariesPushed" />
          </Typography>
        </Box>

        <Box
          sx={{
            transition: "all 1000ms",
            transform: textVisible ? "translateY(0)" : "translateY(32px)",
            opacity: textVisible ? 1 : 0,
            transitionDelay: "1s",
          }}
        >
          <Button
            href="/explore"
            variant="secondary"
            size="large"
          >
            <Text id="home.exploreProcess" />
          </Button>
        </Box>

        <Box sx={{ position: "absolute", top: 80, left: 40, width: 128, height: 4, bgcolor: "rgba(255,255,255,0.3)", transformOrigin: "left" }}>
          <Box
            sx={{
              height: "100%",
              bgcolor: "white",
              transition: "width 1500ms",
              width: textVisible ? "100%" : "0%",
              transitionDelay: "0.4s",
            }}
          />
        </Box>

        <Box sx={{ position: "absolute", bottom: 80, right: 40, width: 128, height: 4, bgcolor: "rgba(255,255,255,0.3)", transformOrigin: "right" }}>
          <Box
            sx={{
              height: "100%",
              bgcolor: "white",
              transition: "width 1500ms",
              width: textVisible ? "100%" : "0%",
              transitionDelay: "1.2s",
            }}
          />
        </Box>
      </Box>

      <style>{`
        @keyframes pulse-animation {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.2; }
        }
      `}</style>
    </Box>
  );
}


