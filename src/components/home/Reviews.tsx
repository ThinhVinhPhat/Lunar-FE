import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  product: string;
}

const Reviews = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews: Review[] = [
    {
      id: 1,
      author: "Michael K.",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 5,
      date: "July 15, 2023",
      text: "These are the best sunglasses I've ever owned. The wood finish is beautiful and the quality is outstanding. Worth every penny!",
      product: "Canby Wood Sunglasses",
    },
    {
      id: 2,
      author: "Sarah L.",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      date: "August 3, 2023",
      text: "Absolutely love my new shades! They're lightweight, stylish, and I get compliments everywhere I go. The sustainable materials are a huge plus.",
      product: "Pearl Metal Sunglasses",
    },
    {
      id: 3,
      author: "David R.",
      avatar: "https://i.pravatar.cc/150?img=8",
      rating: 5,
      date: "September 12, 2023",
      text: "The craftsmanship is exceptional. These sunglasses are not only beautiful but also incredibly comfortable. Customer service was excellent too!",
      product: "Kennedy Acetate Sunglasses",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative h-[400px] overflow-hidden">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`absolute w-full transition-all duration-700 ease-in-out ${
              index === activeIndex
                ? "opacity-100 translate-x-0"
                : index < activeIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-[#C8A846]"
                />
                <div className="absolute -bottom-2 right-0 bg-[#C8A846] rounded-full p-2">
                  <FontAwesomeIcon
                    icon={faQuoteRight}
                    className="text-white w-4 h-4"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className="text-[#C8A846] w-4 h-4"
                  />
                ))}
              </div>

              <p className="text-lg text-gray-600 italic mb-6 px-4">
                "{review.text}"
              </p>

              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-[#2c2c2c]">
                  {review.author}
                </h4>
                <p className="text-[#C8A846] font-medium">{review.product}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-[#C8A846] w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;
