import { useState, useCallback } from "react";
import { Product } from "@/shared/types/product";

export const useFilter = () => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
    materials: true,
    shapes: true,
    price: true,
  });
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

  const toggleSection = useCallback(
    (section: keyof typeof openSections) => {
      setOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    []
  );

  const handleFilterChange = useCallback(
    (type: keyof typeof activeFilters, value: string) => {
      setActiveFilters((prev) => {
        const currentFilters = prev[type] as string[];
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
      });
    },
    []
  );

  const clearFilters = useCallback(() => {
    setActiveFilters({
      categories: [],
      colors: [],
      materials: [],
      shapes: [],
      priceRange: null,
    });
  }, []);

  const applyFilters = useCallback(
    (products: Product[]) => {
      let filtered = [...products];

      if (activeFilters.categories.length > 0) {
        filtered = filtered.filter((product) => {
          const categoryName = product.productCategories.find((category) => 
            category.categoryDetails.name === activeFilters.categories[0]
          )?.categoryDetails.name;
          return categoryName && activeFilters.categories.includes(categoryName);
        });
      }

      if (activeFilters.colors.length > 0) {
        filtered = filtered.filter((product) =>
          product.allColors?.some((color) =>
            activeFilters.colors.includes(color.color)
          )
        );
      }

      if (activeFilters.materials.length > 0) {
        filtered = filtered.filter((product) => {
          const materialName = product.productCategories.find((category) => 
            category.categoryDetails.name === activeFilters.materials[0]
          )?.categoryDetails.name;
          return materialName && activeFilters.materials.includes(materialName);
        });
      } 

      if (activeFilters.shapes.length > 0) {
        filtered = filtered.filter((product) => {
          const shapeName = product.productCategories.find((category) => 
            category.categoryDetails.name === activeFilters.shapes[0]
          )?.categoryDetails.name;
          return shapeName && activeFilters.shapes.includes(shapeName);
        });
      }

      if (activeFilters.priceRange) {
        const [min, max] = activeFilters.priceRange;
        filtered = filtered.filter(
          (product) => Number(product.price) >= min && Number(product.price) <= max
        );
      }

      return filtered;
    },
    [activeFilters]
  );

  return {
    openSections,
    activeFilters,
    toggleSection,
    handleFilterChange,
    clearFilters,
    applyFilters,
    setActiveFilters
  };
};


