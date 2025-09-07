import {
  Box,
  Typography,
  Button,
  Collapse,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

type FilterItemProps = {
  name: string;
  activeFilters: Record<string, string[]>;
  handleFilterChange: (filter: "categories" | "colors" | "materials" | "shapes" | "priceRange", value: string) => void;
  toggleSection: (section: "categories" | "colors" | "materials" | "shapes" | "price") => void;
  openSections: Record<string, boolean>;
  filterOptions: Record<string, string[]>;
};

function FilterItem({
  name,
  activeFilters,
  handleFilterChange,
  toggleSection,
  openSections,
  filterOptions,
}: FilterItemProps) {
  const isSectionOpen = openSections[name];

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", py: 2 }}>
      <Button
        fullWidth
        onClick={() => toggleSection(name as "categories" | "colors" | "materials" | "shapes" | "price")}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textTransform: "capitalize",
          color: "text.primary",
          fontWeight: "medium",
          px: 0,
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Typography>
        {isSectionOpen ? <ExpandLess /> : <ExpandMore />}
      </Button>
      <Collapse in={isSectionOpen} timeout="auto" unmountOnExit>
        <FormGroup sx={{ mt: 1, ml: 1 }}>
          {filterOptions[name].map((category: string) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={activeFilters[name]?.includes(category) || false}
                  onChange={() => handleFilterChange(name as "categories" | "colors" | "materials" | "shapes" | "priceRange", category)}
                  sx={{ color: "#C8A846", "&.Mui-checked": { color: "#C8A846" } }}
                />
              }
              label={category}
            />
          ))}
        </FormGroup>
      </Collapse>
    </Box>
  );
}

export default FilterItem;


