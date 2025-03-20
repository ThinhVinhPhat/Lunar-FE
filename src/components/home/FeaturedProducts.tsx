import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductType } from "../../types/product";
import ProductItem from "../product/ProductItem";

type FeaturedProductsProps = {
  products: ProductType[] | null;
  isLoading: boolean;
};
const FeaturedProducts = ({ products, isLoading }: FeaturedProductsProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className=" w-full">
      <div className="container mx-auto  w-full">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#2c2c2c]">
              Shop Our Most Popular Styles
            </h2>
          </div>
          <Link
            to="/products"
            className="text-[#2c2c2c] hover:text-[#C8A846] transition-colors duration-300 flex items-center gap-2"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-200 h-80 mb-4"></div>
                  <div className="p-4">
                    <div className="bg-gray-200 h-4 w-2/3 mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/3"></div>
                  </div>
                </div>
              ))
            : products
                ?.slice(0, 4)
                .map((product: ProductType) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                  />
                ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
