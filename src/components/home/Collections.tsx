import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useGetCategoriesDetailByCateName } from "../../hooks/queryClient/query/category";
import { CategoryDetail } from "@/types/category";

const Collections = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isLoadingCategories ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="overflow-hidden">
            <div
              className="transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="grid md:grid-cols-3 gap-7 min-w-full"
                  style={{
                    display: slideIndex === currentSlide ? "grid" : "none",
                  }}
                >
                  {getSlideItems(slideIndex)?.map(
                    (category: CategoryDetail, index: number) => {
                      const image = category?.image
                        ?.replace(/[{}"]/g, "")
                        .split(",");
                      return (
                        <div
                          key={`${category.id}-${slideIndex}-${index}`}
                          className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-500 hover:-translate-y-2"
                          onMouseEnter={() => setHoveredId(category.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() =>
                            navigate(`/collections/${category.id}`)
                          }
                        >
                          <div className="relative aspect-[4/5] overflow-hidden">
                            <img
                              src={
                                hoveredId === category?.id && image
                                  ? image[0]
                                  : image
                                  ? image[1]
                                  : ""
                              }
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              alt={category.name}
                            />

                            <div className="absolute top-4 left-4 bg-[#C8A846] text-white text-xs px-3 py-1 rounded">
                              {category.name}
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-2">
                              {category.name}
                            </h3>
                            <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                              {category.description}
                            </p>

                            <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150 hover:bg-[#b69339] transform group-hover:translate-y-0 translate-y-4">
                              Explore Collection
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ))}
            </div>
          </div>

          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-md z-10 transition-all duration-300"
                aria-label="Previous slide"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-md z-10 transition-all duration-300"
                aria-label="Next slide"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}

          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-[#C8A846] w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Collections;
