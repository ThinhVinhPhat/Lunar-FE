import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/Button";
import Text from "../wrapper/Text";
import { useState, useRef, useEffect } from "react";
import { heroSlides } from "../../database/home";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const autoplayRef = useRef(null);
  const heroRef = useRef(null);

  const totalSlides = heroSlides.length;

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleMouseEnter = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  useEffect(() => {
    setTextVisible(false);
    const timer = setTimeout(() => setTextVisible(true), 200);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
    >
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.image}
                alt={`Hero slide ${index + 1}`}
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                  index === currentSlide && isInView ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>

            <div className="absolute inset-0 opacity-10">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 bg-white rounded-full animate-pulse transition-all duration-[3000ms] ${
                    index === currentSlide && isInView
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center max-w-4xl px-4">
                <h1
                  className={`text-6xl md:text-7xl font-bold mb-6 transition-all duration-1000 transform ${
                    index === currentSlide && textVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <span className="inline-block">
                    <Text id={slide.title} />
                  </span>
                </h1>

                <p
                  className={`text-xl md:text-2xl mb-8 transition-all duration-1000 transform ${
                    index === currentSlide && textVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "0.3s" }}
                >
                  <Text id={slide.subtitle} />
                </p>

                <div
                  className={`transition-all duration-1000 transform ${
                    index === currentSlide && textVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: "0.6s" }}
                >
                  <Button
                    href={slide.buttonLink}
                    variant="secondary"
                    className="animate-bounce-subtle hover:animate-none"
                  >
                    <Text id={slide.buttonText} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute top-1/4 left-10 w-32 h-1 bg-white/30">
              <div
                className={`h-full bg-white transition-all duration-1500 ${
                  index === currentSlide && textVisible ? "w-full" : "w-0"
                }`}
                style={{ transitionDelay: "0.8s" }}
              ></div>
            </div>

            <div className="absolute bottom-1/4 right-10 w-32 h-1 bg-white/30">
              <div
                className={`h-full bg-white transition-all duration-1500 ${
                  index === currentSlide && textVisible ? "w-full" : "w-0"
                }`}
                style={{ transitionDelay: "1s" }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full shadow-lg z-10 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full shadow-lg z-10 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {totalSlides > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "bg-white w-8 h-3"
                  : "bg-white/50 hover:bg-white/70 w-3 h-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-8 right-8 text-white/70 text-sm font-medium z-10">
        {currentSlide + 1} / {totalSlides}
      </div>

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
    </section>
  );
};

export default Hero;
