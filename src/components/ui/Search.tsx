import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Product } from "@/types/product";
import { useProducts } from "../../hooks/queryClient/query/product/products";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";
import IsLoadingWrapper from "../wrapper/isLoading";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { products, isLoading } = useProducts();
  const { t } = useTranslation();
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const debouncedValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.products.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        product.productCategories.some((category) =>
          category.categoryDetails.name
            .toLowerCase()
            .includes(debouncedValue.toLowerCase())
        ) ||
        product.description
          ?.toLowerCase()
          .includes(debouncedValue.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [debouncedValue, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-start justify-center pt-10 px-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden transform transition-all"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-900">
              {t("search.search_products")}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close search"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="relative mb-6">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t("search.search_placeholder")}
              className="w-full py-3 pl-12 pr-10 border-b-2 border-gray-200 focus:border-[#C8A846] focus:outline-none text-lg"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>

          {!searchQuery && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {t("search.popular_searches")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Sunglasses",
                  "Wooden frames",
                  "Polarized",
                  "New arrivals",
                  "Bestsellers",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 hover:bg-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            {searchQuery ? (
              <IsLoadingWrapper isLoading={isLoading}>
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      {filteredProducts.length} {t("search.results_for")} "
                      {searchQuery}"
                    </h4>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pb-4">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-w-1 aspect-h-1 bg-gray-200 relative overflow-hidden">
                            {product.images && product.images[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-lg font-bold text-[#C8A846]">
                              ${product.price}
                            </p>
                            <div className="mt-2">
                              <button
                                onClick={() => {
                                  window.location.href = `/product/${product.slug}`;
                                  onClose();
                                }}
                                className="w-full py-2 bg-[#C8A846] text-white rounded hover:bg-[#b39a3f] transition-colors"
                              >
                                {t("search.view_details")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {t("search.no_products_found")} "{searchQuery}"
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {t("search.try_different_search_term")}
                      </p>
                    </div>
                  )}
                </>
              </IsLoadingWrapper>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
