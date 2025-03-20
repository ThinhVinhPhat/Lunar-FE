import { Category, CategoryDetail } from "../../types/category";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type FeaturedCollectionProps = {
  categories: Category[] | null;
};

function FeaturedCollection({ categories }: FeaturedCollectionProps) {
  return (
    <div className="max-w-[1540px] mx-auto px-4 py-12">
      <section className="mb-16 relative">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Collections
        </h2>

        <div className="swiper-button-prev absolute left-0 top-1/2 z-10 -mt-12 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer">
          <FiArrowLeft className="text-gray-800" />
        </div>

        <div className="swiper-button-next absolute right-0 top-1/2 z-10 -mt-12 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer">
          <FiArrowRight className="text-gray-800" />
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="collection-swiper"
        >
          {categories?.map((category: CategoryDetail) => {
            const image = category?.image?.replace(/[{}"]/g, "").split(",");
            return (
              <SwiperSlide key={category.id}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={image?.[0]}
                      alt={category.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-xl font-bold text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600">{category.description}</p>
                  <button className="mt-3 text-[#C8A846] hover:underline font-medium">
                    Shop Now
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    </div>
  );
}

export default FeaturedCollection;
