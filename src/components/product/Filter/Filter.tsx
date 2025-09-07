import { Product } from "@/shared/types/product";
import FilterItem from "./FitlerItem";
import { filterOptions } from "@/database/filter";
import Text from "@/shared/components/wrapper/Text";
import { Button } from "@/shared/components/Button";
import { useFilter } from "@/shared/hooks/useFilter";

import {
  Box,
  Typography,
  IconButton,
  List,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type FilterProps = {
  isLoading?: boolean;
  products?: Product[];
  type?: "collection" | "product";
  onClose?: () => void;
  openSections?: {
    categories: boolean;
    colors: boolean;
    materials: boolean;
    shapes: boolean;
    price: boolean;
  };
  activeFilters?: {
    categories: string[];
    colors: string[];
    materials: string[];
    shapes: string[];
    priceRange: [number, number] | null;
  };
  toggleSection?: (section: "categories" | "colors" | "materials" | "shapes" | "price") => void;
  handleFilterChange?: (type: "categories" | "colors" | "materials" | "shapes" | "priceRange", value: string) => void;
  clearFilters?: () => void;
  applyFilters?: (products: Product[]) => Product[];
};

function Filter({
  onClose,
  openSections: propOpenSections,
  activeFilters: propActiveFilters,
  toggleSection: propToggleSection,
  handleFilterChange: propHandleFilterChange,
  clearFilters: propClearFilters,
}: FilterProps) {
  const hookData = useFilter();  
  const openSections = propOpenSections || hookData.openSections;
  const activeFilters = propActiveFilters || hookData.activeFilters;
  const toggleSection = propToggleSection || hookData.toggleSection;
  const handleFilterChange = propHandleFilterChange || hookData.handleFilterChange;
  const clearFilters = propClearFilters || hookData.clearFilters;

  const activeFilterCount = activeFilters ? 
    Object.values(activeFilters).reduce((count, filterArray) => {
      if (Array.isArray(filterArray)) {
        return count + filterArray.length;
      }
      return filterArray ? count + 1 : count;
    }, 0) : 0;

  const filterContent = (
    <Box sx={{ width: { xs: '100vw', sm: 400 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 3,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h5" fontWeight="bold">
          <Text id="product_list.filters" />
        </Typography>
        {onClose && (
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <List sx={{ p: 0 }}>
          {Object.keys(filterOptions).map((filterKey) => {
            if (!handleFilterChange || !toggleSection) {
              return null;
            }
            
            return (
              <FilterItem
                key={filterKey}
                name={filterKey}
                activeFilters={(() => {
                  const filters = activeFilters || { categories: [], colors: [], materials: [], shapes: [], priceRange: null };
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { priceRange, ...arrayFilters } = filters;
                  return arrayFilters;
                })()}
                handleFilterChange={handleFilterChange}
                toggleSection={toggleSection}
                openSections={openSections || { categories: true, colors: true, materials: true, shapes: true, price: true }}
                filterOptions={filterOptions}
              />
            );
          })}
        </List>
      </Box>
      
      <Box sx={{ 
        p: 1, 
        borderTop: 1, 
        borderColor: 'divider',
        display: "flex", 
        justifyContent: "flex-end",
        gap: 3 
      }}>
        <Button
          variant="outline"
          onClick={clearFilters}
          size="large"
        >
          <Text id="product_list.clear_all_filters" />
        </Button>
        <Button
          variant="primary"
          onClick={onClose}
          size="large"
        >
          <Text id="product_list.apply_filters" /> ({activeFilterCount})
        </Button>
      </Box>
    </Box>
  );

  return filterContent;
}

export default Filter;

