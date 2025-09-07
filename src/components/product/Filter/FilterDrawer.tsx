import { useState } from "react";
import { Product } from "@/shared/types/product";
import Filter from "./Filter";
import { useFilter } from "@/shared/hooks/useFilter";
import {
  Drawer,
} from "@mui/material";

type FilterDrawerProps = {
  products: Product[];
  isLoading?: boolean;
  children: (props: {
    filteredProducts: Product[];
    activeFilterCount: number;
    openFilter: () => void;
  }) => React.ReactNode;
};

const FilterDrawer = ({ products, isLoading, children }: FilterDrawerProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    openSections,
    activeFilters,
    toggleSection,
    handleFilterChange,
    clearFilters,
    applyFilters,
  } = useFilter();

  const filteredProducts = applyFilters(products || []);
  const activeFilterCount = Object.values(activeFilters).flat().length;

  const openFilter = () => setFilterOpen(true);
  const closeFilter = () => setFilterOpen(false);

  return (
    <>
      {children({ filteredProducts, activeFilterCount, openFilter })}
      
      <Drawer
        anchor="right"
        open={filterOpen}
        onClose={closeFilter}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: 400 },
            maxWidth: '100vw'
          }
        }}
      >
        <Filter
          isLoading={isLoading}
          products={products}
          type="product"
          onClose={closeFilter}
          openSections={openSections}
          activeFilters={activeFilters}
          toggleSection={toggleSection}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          applyFilters={applyFilters}
        />
      </Drawer>
    </>
  );
};

export default FilterDrawer;
