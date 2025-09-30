import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { Product } from "@/shared/types/product";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { useProductBySuggestion } from "@/lib/hooks/queryClient/query/product/product.query";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import ProductSearch, { SearchResultItem } from "./ProductSearch";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@/shared/components/Pagination";
import usePagination from "@/shared/hooks/usePagination";
import { useProductVariants } from "@/lib/hooks/queryClient/query/product-variant/product-variant.query";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [completion, setCompletion] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(searchQuery, 500);
  
  const pagination = usePagination({
    initialPage: 1,
    initialLimit: 6,
    maxLimit: 50
  });

  const { data: productSuggestionResponse, isLoading: isLoadingSuggestion, products: productSuggestions } =
    useProductBySuggestion(debouncedValue, pagination.page, pagination.limit);
  const { data: allProductVariants, isLoading: isLoadingAllProducts, total } = useProductVariants({
    limit: pagination.limit,
    page: pagination.page,
  });
  const navigate = useNavigate();

  // Combine search results: Products and ProductVariants
  const combinedSearchResults: SearchResultItem[] = searchQuery 
    ? [...(productSuggestions || []), ...(allProductVariants || [])]
    : [...(allProductVariants || [])];

  const totalResults = searchQuery 
    ? (productSuggestionResponse?.total || 0) + (total || 0)
    : (total || 0);

  useEffect(() => {
    pagination.setTotalItems(totalResults);
  }, [totalResults, pagination]);

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

  useEffect(() => {
    if (productSuggestions?.length > 0 && debouncedValue.trim()) {
      const suggestions = productSuggestions.filter((product: Product) =>
        product?.name?.toLowerCase().startsWith(debouncedValue?.toLowerCase())
      );

      if (suggestions.length > 0 && debouncedValue.length > 0) {
        const firstMatch = suggestions[0].name;
        setCompletion(firstMatch.slice(debouncedValue.length));
        setShowCompletion(true);
      } else {
        setCompletion("");
        setShowCompletion(false);
      }
    } else {
      setCompletion("");
      setShowCompletion(false);
    }
  }, [productSuggestions, debouncedValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && showCompletion) {
      e.preventDefault();
      if (completion) {
        setSearchQuery(searchQuery + completion);
        setCompletion("");
        setShowCompletion(false);
        setSelectedSuggestionIndex(0);
      }
    }

    if (productSuggestions?.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < productSuggestions?.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > -1 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        const selectedProduct = productSuggestions[selectedSuggestionIndex];
        navigate(`/product/${selectedProduct.slug}`);
        onClose();
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedSuggestionIndex(-1);
    pagination.goToFirstPage();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCompletion("");
    setShowCompletion(false);
    setSelectedSuggestionIndex(-1);
    pagination.goToFirstPage();
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
            <div className="relative mb-6">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder={t("search.search_placeholder")}
                className="w-full py-3 pl-12 pr-10 border-b-2 border-gray-200 focus:border-[#C8A846] focus:outline-none text-lg"
              />
              {showCompletion && (
                <span
                  className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  style={{ left: `${searchQuery.length * 10 + 78}px` }}
                >
                  <span className="text-gray-300">{completion}</span>
                </span>
              )}
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

            <IsLoadingWrapper
              isLoading={
                searchQuery ? isLoadingSuggestion : isLoadingAllProducts
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {combinedSearchResults.length > 0 ? (
                    <ProductSearch
                      products={combinedSearchResults}
                      onClose={onClose}
                    />
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-8">
                      {searchQuery && !isLoadingSuggestion
                        ? t("search.no_results")
                        : t("search.no_products")}
                    </div>
                  )}
                </div>

                {totalResults > 0 && (
                  <div className="mt-6">
                    <Pagination
                      productCount={totalResults}
                      currentPage={pagination.page}
                      onSetPage={pagination.handlePageChange}
                      limit={pagination.limit}
                      onLimitChange={pagination.handleLimitChange}
                      variant="compact"
                      showItemsPerPage={true}
                      showPageInfo={true}
                    />
                  </div>
                )}
              </div>
            </IsLoadingWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
