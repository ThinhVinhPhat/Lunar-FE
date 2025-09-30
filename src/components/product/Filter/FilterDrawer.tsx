import { useState } from "react";
import Filter from "./Filter";
import { useFilter } from "@/shared/hooks/useFilter";
import {
  Drawer,
} from "@mui/material";
import { Product } from "@/shared/types/product";
import { ProductVariantResponse } from "@/shared/types/product-varitant";

type SearchResultItem = Product | ProductVariantResponse;

type FilterDrawerProps = {
  products: SearchResultItem[] | null;
  isLoading?: boolean;
  children: (props: {
    filteredProducts: SearchResultItem[] | null;
    activeFilterCount: number;
    openFilter: () => void;
  }) => React.ReactNode;
};

const FilterDrawer = ({ products, isLoading, children }: FilterDrawerProps): React.JSX.Element => {
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    openSections,
    activeFilters,
    toggleSection,
    handleFilterChange,
    clearFilters,
    applyProductFilters,
  } = useFilter();

  const isProduct = (item: SearchResultItem): item is Product => {
    return 'variants' in item;
  };

  const isProductVariant = (item: SearchResultItem): item is ProductVariantResponse => {
    return 'product' in item;
  };

  const applyUnifiedFilters = (items: SearchResultItem[]) => {
    const products: Product[] = [];
    
    items.forEach(item => {
      if (isProduct(item)) {
        products.push(item);
      } else if (isProductVariant(item)) {
        if (item.product) {
          const existingProduct = products.find(p => p.id === item.product.id);
          if (!existingProduct) {
            products.push(item.product);
          }
        }
      }
    });
    
    const filteredProducts = applyProductFilters(products);
    return filteredProducts as SearchResultItem[];
  };
  
  const filteredProducts = applyUnifiedFilters(products || []);
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
          onClose={closeFilter}
          openSections={openSections}
          activeFilters={activeFilters}
          toggleSection={toggleSection}
          handleFilterChange={handleFilterChange}
          clearFilters={clearFilters}
          applyFilters={applyUnifiedFilters}
        />
        
      </Drawer>
    </>
  );
};

export default FilterDrawer;
