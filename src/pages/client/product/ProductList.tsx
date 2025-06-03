import { useState } from "react";
import Filter from "../../../components/product/Filter/Filter";
import { useParams } from "react-router-dom";
import { Pagination } from "../../../components/ui/Pagination";
import Text from "../../../components/wrapper/Text";
import { useProductAction } from "../../../hooks/useProductAction";
import IsLoadingWrapper from "../../../components/wrapper/isLoading";
const ProductList = () => {
  const { type } = useParams();
  const [page, setPage] = useState(1);
  const offset = (page - 1) * 10;
  const [currentFiltered, setCurrentFiltered] = useState<string[]>([]);
  const { products, isLoading, total } = useProductAction(offset, 10, {
    category: currentFiltered,
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
            <Text id="product_list.premium_eyewear_collection" />
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            <Text id="product_list.discover_our_handcrafted_frames_made_from_sustainable_materials" />
          </p>
        </div>
      </div>
      <IsLoadingWrapper isLoading={isLoading}>
        <>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <section>
              <Pagination
                productCount={total}
                currentPage={page}
                onSetPage={setPage}
              />
              <Filter
                isLoading={isLoading}
                filteredProducts={products}
                onFilterChange={setCurrentFiltered}
                type="product"
              />
            </section>

            <section className="bg-gray-100 py-16 mt-16">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  <Text id="product_list.join_our_newsletter" />
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  <Text id="product_list.subscribe_to_receive_updates_on_new_collections_exclusive_offers_and_eyewear_care_tips" />
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
                    <Text id="product_list.subscribe" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </>
      </IsLoadingWrapper>
    </div>
  );
};

export default ProductList;
