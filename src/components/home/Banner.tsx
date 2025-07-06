import Text from "../wrapper/Text";
import { Button } from "../ui/Button";
import { useState, useEffect, useRef } from "react";

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
    <div ref={bannerRef} className="relative text-center mb-16 overflow-hidden">
      <div className="relative flex justify-center m-1 align-middle w-100 overflow-hidden">
        <img
          className={`w-[100rem] h-[40rem] object-cover transition-all duration-[3000ms] ease-out transform ${
            isLoaded ? "scale-110" : "scale-100"
          }`}
          src="https://shwoodshop.com/cdn/shop/files/Experiment-Desktop.jpg?v=1736452704&width=1920"
          alt="Experimenting Everyday"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>

        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-white rounded-full animate-pulse transition-all duration-[2000ms] ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-64 left-0 w-full h-full">
        <h1
          className={`text-6xl font-bold mb-4 text-[#f1efef] transition-all duration-1000 transform ${
            textVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <span
            className={`inline-block transition-all duration-700 transform ${
              textVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <Text id="home.experimentingEveryday" />
          </span>
        </h1>

        <div className="flex flex-col justify-center items-center w-1/2 mx-auto">
          <p
            className={`text-[#fff] mb-10 text-2xl text-left ml-10 flex flex-col justify-center items-center transition-all duration-1000 transform ${
              textVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "0.6s" }}
          >
            <Text id="home.boundariesPushed" />
          </p>
        </div>

        <div
          className={`transition-all duration-1000 transform ${
            textVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "1s" }}
        >
          <Button
            href="/explore"
            variant="secondary"
            size="medium"
          >
            <Text id="home.exploreProcess" />
          </Button>
        </div>

        <div className="absolute top-20 left-10 w-32 h-1 bg-white/30 transform origin-left">
          <div
            className={`h-full bg-white transition-all duration-1500 ${
              textVisible ? "w-full" : "w-0"
            }`}
            style={{ transitionDelay: "0.4s" }}
          ></div>
        </div>

        <div className="absolute bottom-20 right-10 w-32 h-1 bg-white/30 transform origin-right">
          <div
            className={`h-full bg-white transition-all duration-1500 ${
              textVisible ? "w-full" : "w-0"
            }`}
            style={{ transitionDelay: "1.2s" }}
          ></div>
        </div>
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
