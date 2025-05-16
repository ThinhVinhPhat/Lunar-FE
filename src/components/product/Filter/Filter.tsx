import { Product } from "@/types/product";
import { FiFilter } from "react-icons/fi";
import ProductItem from "../ProductItem";
import FilterItem from "./FitlerItem";
import { filterOptions } from "../../../database/filter";
import { useFilter } from "../../../hooks/useFilter";
import Text from "../../wrapper/Text";
import { useProductAction } from "../../../hooks/useProductAction";
import IsLoadingWrapper from "../../wrapper/isLoading";
type FilterProps = {
  isLoading: boolean;
  filteredProducts: Product[];
  onFilterChange: (filters: string[]) => void;
  type: "collection" | "product";
};

function Filter({
  isLoading,
  filteredProducts,
  onFilterChange,
  type,
}: FilterProps) {
  const {
    openSections,
    hoveredId,
    activeFilters,
    toggleFilter,
    toggleSection,
    handleFilterChange,
    clearFilters,
    setHoveredId,
  } = useFilter(onFilterChange);
  const { handleFavoriteProduct } = useProductAction();
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          <Text id="product_list.all_products" />
        </h2>
        <button
          onClick={() => toggleFilter()}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md md:hidden"
        >
          <FiFilter className="mr-2" /> <Text id="product_list.filters" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-4">
                <Text id="product_list.filters" />
              </h3>
              <button
                onClick={clearFilters}
                className="text-[#C8A846] hover:underline text-sm"
              >
                <Text id="product_list.clear_all_filters" />
              </button>
            </div>
            {Object.keys(filterOptions)?.map((key) => {
              if (type === "collection") {
                if (key !== "collections") {
                  return (
                    <FilterItem
                      key={key}
                      name={key}
                      activeFilters={activeFilters}
                      handleFilterChange={handleFilterChange}
                      toggleSection={toggleSection}
                      openSections={openSections}
                      filterOptions={{
                        ...filterOptions,
                        collections: "",
                      }}
                    />
                  );
                }
              } else if (type === "product") {
                return (
                  <FilterItem
                    key={key}
                    name={key}
                    activeFilters={activeFilters}
                    handleFilterChange={handleFilterChange}
                    toggleSection={toggleSection}
                    openSections={openSections}
                    filterOptions={filterOptions}
                  />
                );
              }
            })}
            <div className="mt-8">
              <button
                onClick={() => {
                  toggleFilter();
                  window.scrollTo({ top: 50, behavior: "smooth" });
                }}
                className="w-full py-3 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors"
              >
                <Text id="product_list.apply_filters" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                <Text id="product_list.no_products_found_matching_your_criteria" />
              </p>
            </div>
          ) : (
            <IsLoadingWrapper isLoading={isLoading}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    handleFavoriteProduct={handleFavoriteProduct}
                  />
                ))}
              </div>
            </IsLoadingWrapper>
          )}
        </div>
      </div>
    </>
  );
}

export default Filter;
