import { useState } from "react";

export const useFilter = (onFilterChange: (filters: any) => void) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    colors: true,
    materials: true,
    shapes: true,
    price: true,
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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

  return {
    openSections,
    hoveredId,
    activeFilters,
    setHoveredId,
    toggleFilter,
    toggleSection,
    handleFilterChange,
    clearFilters,
  };
};
