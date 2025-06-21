import { useState } from "react";
import ProductItem from "../product/ProductItem";
import { Product } from "../../types/product";
import Text from "../wrapper/Text";
import { useProductAction } from "../../hooks/useProductAction";

const FeaturedProducts = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { products, isLoading, handleFavoriteProduct } = useProductAction();

  const mostViewedProducts = products
    ?.sort((a: Product, b: Product) => b.views - a.views)
    .slice(0, 4);

  return (
    <section className=" w-full">
      <div className="container mx-auto  w-full">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#2c2c2c]">
              <Text id="home.shopOurMostPopularStyles" />
            </h2>
          </div>
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
            : mostViewedProducts?.map((product: Product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  handleFavoriteProduct={handleFavoriteProduct}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
