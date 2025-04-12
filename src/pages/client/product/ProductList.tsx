import { useState } from "react";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import Filter from "../../../components/product/Filter/Filter";
import { useParams } from "react-router-dom";
import { useProducts } from "../../../hooks/queryClient/query/product/products";
import { Pagination } from "../../../components/ui/Pagination";

const ProductList = () => {
  const { type } = useParams();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * 10;
  const [currentFiltered, setCurrentFiltered] = useState<string[]>([]);
  const { products, isLoading } = useProducts({
    category: currentFiltered,
    offset,
    limit: 10,
  });
  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="relative bg-gray-900 text-white">
        {type === "men" ? (
          <img
            src="https://shwoodshop.com/cdn/shop/collections/f0395074198cd18e070e805ac2f80682_99a27b1f-60f2-4f74-afe7-061d0b89fa36.jpg?v=1658366448&width=1920"
            alt="Eyewear Collection"
            className="w-full h-64 md:h-96 object-cover opacity-70"
          />
        ) : (
          <img
            src="https://shwoodshop.com/cdn/shop/collections/702d24259e3886ae6e511220fd938f2e.jpg?v=1658272432&width=1920"
            alt="Eyewear Collection"
            className="w-full h-64 md:h-96 object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premium Eyewear Collection
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Discover our handcrafted frames made from sustainable materials
          </p>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <section>
              <Pagination
                productCount={products.productCount}
                currentPage={page}
                onSetPage={setPage}
              />
              <Filter
                isLoading={isLoading}
                filteredProducts={products.products}
                onFilterChange={setCurrentFiltered}
                type="product"
              />
            </section>

            <section className="bg-gray-100 py-16 mt-16">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Subscribe to receive updates on new collections, exclusive
                  offers, and eyewear care tips.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
