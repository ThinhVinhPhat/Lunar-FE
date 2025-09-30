import { useState, useCallback } from "react";
import { ProductVariantResponse } from "../types/product-varitant";
import { Product } from "../types/product";

export const useFilter = () => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
    collections: true,
    shapes: true,
    price: true,
  });
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    colors: string[];
    collections: string[];
    shapes: string[];
    priceRange: [number, number] | null;
  }>({
    categories: [],
    colors: [],
    collections: [],
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
        if (currentFilters?.includes(value)) {
          return {
            ...prev,
            [type]: currentFilters?.filter((item) => item !== value),
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
      collections: [],
      shapes: [],
      priceRange: null,
    });
  }, []);

  const applyFilters = useCallback(
    (products: ProductVariantResponse[]) => {
      let filtered = [...products];

      if (activeFilters.categories.length > 0) {
        filtered = filtered.filter((product) => {
          const categoryName = product.productCategories?.find((category) => 
            category.categoryDetail?.name === activeFilters.categories[0]
          )?.categoryDetail?.name;
          return categoryName && activeFilters?.categories?.includes(categoryName);
        });
      }

      if (activeFilters.collections.length > 0) {
        filtered = filtered.filter((product) => {
          const collectionName = product.productCategories?.find((category) => 
            category.categoryDetail?.name === activeFilters.collections[0]
          )?.categoryDetail?.name;
          return collectionName && activeFilters?.collections?.includes(collectionName);
        });
      } 

      if (activeFilters.shapes.length > 0) {
        filtered = filtered.filter((product) => {
          const shapeName = product.productCategories?.find((category) => 
            category.categoryDetail?.name === activeFilters.shapes[0]
          )?.categoryDetail?.name;
          return shapeName && activeFilters?.shapes?.includes(shapeName);
        });
      }

      if (activeFilters.priceRange) {
        const [min, max] = activeFilters?.priceRange ;
        filtered = filtered.filter(
          (product) => Number(product.price) >= min && Number(product.price) <= max
        );
      }

      return filtered;
    },
    [activeFilters]
  );

  const applyProductFilters = useCallback(
    (products: Product[]) => {
      let filtered = [...products];

      if (activeFilters.categories.length > 0 || 
          activeFilters.colors.length > 0 ||
          activeFilters.collections.length > 0 || 
          activeFilters.shapes.length > 0 || 
          activeFilters.priceRange) {
        
        filtered = filtered.filter((product) => {
          const variants = product.variants || [];
          
          return variants.some((variant) => {
            if (activeFilters.categories.length > 0) {
              const hasMatchingCategory = variant.productCategories?.some((category) => {
                const categoryName = category.categoryDetail?.name;
                console.log('Checking category:', categoryName, 'against filters:', activeFilters.categories);
                return categoryName && activeFilters.categories.includes(categoryName);
              });
              if (!hasMatchingCategory) return false;
            }

            if (activeFilters.colors.length > 0) {
              const variantColor = variant.color;
              console.log('Checking variant color:', variantColor, 'against filters:', activeFilters.colors);
              const hasMatchingColor = activeFilters.colors.some(filterColor => 
                variantColor.toLowerCase().includes(filterColor.toLowerCase()) ||
                filterColor.toLowerCase().includes(variantColor.toLowerCase())
              );
              if (!hasMatchingColor) return false;
            }

            if (activeFilters.collections && activeFilters.collections.length > 0) {
              const hasMatchingCollection = variant.productCategories?.some((category) => {
                const collectionName = category.categoryDetail?.name;
                console.log('Checking collection:', collectionName, 'against filters:', activeFilters.collections);
                return collectionName && activeFilters.collections.includes(collectionName);
              });
              if (!hasMatchingCollection) return false;
            }

            if (activeFilters.shapes.length > 0) {
              const hasMatchingShape = variant.productCategories?.some((category) => {
                const shapeName = category.categoryDetail?.name;
                console.log('Checking shape:', shapeName, 'against filters:', activeFilters.shapes);
                return shapeName && activeFilters.shapes.includes(shapeName);
              });
              if (!hasMatchingShape) return false;
            }

            if (activeFilters.priceRange) {
              const [min, max] = activeFilters.priceRange;
              const price = Number(variant.price);
              if (price < min || price > max) return false;
            }

            return true;
          });
        });
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
    applyProductFilters,
    setActiveFilters
  };
};


