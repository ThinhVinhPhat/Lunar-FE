import { ProductType } from "@/types/product";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import ProductItem from "../ProductItem";
import FilterItem from "./FitlerItem";

type FilterProps = {
  isLoading: boolean;
  filteredProducts: ProductType[];
  onFilterChange: (filters: string[]) => void;
};

function Filter({ isLoading, filteredProducts, onFilterChange }: FilterProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
    materials: true,
    shapes: true,
    price: true,
  });

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filterOptions = {
    categories: ["Sunglasses", "Eyeglasses", "Accessories"],
    colors: ["Black", "Brown", "Green", "Blue", "Tortoise", "Gold", "Silver"],
    materials: [
      "Wood Classics",
      "Acetate Originals",
      "Metal Originals",
      "CAMP Eyewear",
      "Acetate Originals",
    ],
    shapes: ["Round", "Square", "Rectangle", "Aviator", "Browline"],
  };
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    colors: string[];
    materials: string[];
    shapes: string[];
    priceRange: [number, number] | null;
  }>({
    categories: [],
    colors: [],
    materials: [],
    shapes: [],
    priceRange: null,
  });

  const toggleFilter = () => {
    const result = [
      ...activeFilters.categories,
      ...activeFilters.materials,
      ...activeFilters.shapes,
    ];

    onFilterChange(result);
    setActiveFilters({
      ...activeFilters,
      categories: [],
      materials: [],
      shapes: [],
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  const handleFilterChange = (
    type: keyof typeof activeFilters,
    value: string
  ) => {
    setActiveFilters((prev: any) => {
      if (
        type === "categories" ||
        type === "colors" ||
        type === "materials" ||
        type === "shapes"
      ) {
        const currentFilters = [...prev[type]];
        if (currentFilters.includes(value)) {
          return {
            ...prev,
            [type]: currentFilters.filter((item) => item !== value),
          };
        } else {
          return {
            ...prev,
            [type]: [...currentFilters, value],
          };
        }
      }
      return prev;
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      colors: [],
      materials: [],
      shapes: [],
      priceRange: null,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">All Products</h2>
        <button
          onClick={() => toggleFilter()}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md md:hidden"
        >
          <FiFilter className="mr-2" /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-4">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-[#C8A846] hover:underline text-sm"
              >
                Clear all filters
              </button>
            </div>
            {Object.keys(filterOptions).map((key) => (
              <FilterItem
                key={key}
                name={key}
                activeFilters={activeFilters}
                handleFilterChange={handleFilterChange}
                toggleSection={toggleSection}
                openSections={openSections}
                filterOptions={filterOptions}
              />
            ))}
            <div className="mt-8">
              <button
                onClick={() => toggleFilter()}
                className="w-full py-3 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8A846]"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Filter;
