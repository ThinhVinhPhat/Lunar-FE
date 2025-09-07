import { useEffect, useState } from "react";
import FilterDrawer from "@/components/product/Filter/FilterDrawer";
import { useParams } from "react-router-dom";
import { useProducts } from "@/lib/hooks/queryClient/query/product/product.query";
import { filterCategories } from "@/database/filter";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { Button } from "@/shared/components/Button";
import ProductItem from "@/components/product/ProductItem";
import Text from "@/shared/components/wrapper/Text";

import {
  Box,
  Typography,
  Container,
  TextField,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const CollectionList = () => {
  const { type } = useParams();
  const [initialCategory, setInitialCategory] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { products, isLoading } = useProducts({ category: initialCategory });

  // Mock handleFavoriteProduct function - replace with actual implementation
  const handleFavoriteProduct = (productId: string) => {
    console.log('Toggle favorite for product:', productId);
  };

  useEffect(() => {
    if (filterCategories[type as keyof typeof filterCategories]) {
      setInitialCategory([
        filterCategories[type as keyof typeof filterCategories].category,
      ]);
    }
  }, [type]);

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh", pt: 8 }}>
      <Box sx={{ position: "relative", bgcolor: "grey.900", color: "white" }}>
        <Box
          component="img"
          src={
            filterCategories[type as keyof typeof filterCategories]?.image ||
            "https://shwoodshop.com/cdn/shop/collections/f0395074198cd18e070e805ac2f80682_99a27b1f-60f2-4f74-afe7-061d0b89fa36.jpg?v=1658366448&width=1920"
          }
          alt="Eyewear Collection"
          sx={{ width: "100%", height: { xs: 256, md: 384 }, objectFit: "cover", opacity: 0.7 }}
        />

        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 2, textAlign: "center" }}>
          <Typography variant="h3" component="h1" fontWeight="bold" mb={2}>
            {filterCategories[type as keyof typeof filterCategories]?.category}
          </Typography>
          <Typography variant="h6" maxWidth="md">
            Discover our handcrafted frames made from sustainable materials
          </Typography>
        </Box>
      </Box>
      <IsLoadingWrapper isLoading={isLoading}>
        <Container maxWidth="lg" sx={{ px: 2, py: 4 }}>
          <FilterDrawer products={products || []} isLoading={isLoading}>
            {({ filteredProducts, activeFilterCount, openFilter }) => (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                  <Typography variant="h4" component="h2" fontWeight="bold">
                    {filterCategories[type as keyof typeof filterCategories]?.category || "Collection"}
                  </Typography>
                  <Button
                    onClick={openFilter}
                    variant="outlined-gold"
                    size="medium"
                    icon={<FilterListIcon />}
                    iconPosition="left"
                    className="relative"
                  >
                    <Text id="product_list.filters" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </Box>

                {filteredProducts.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="h6" color="text.secondary" mb={2}>
                      <Text id="product_list.no_products_found_matching_your_criteria" />
                    </Typography>
                    {activeFilterCount > 0 && (
                      <Button
                        onClick={openFilter}
                        variant="primary"
                        size="medium"
                      >
                        <Text id="product_list.clear_all_filters" />
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                      },
                      gap: 3,
                      mb: 6
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <Box key={product.id}>
                        <ProductItem
                          product={product}
                          hoveredId={hoveredId}
                          setHoveredId={setHoveredId}
                          handleFavoriteProduct={handleFavoriteProduct}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            )}
          </FilterDrawer>

          <Box sx={{ bgcolor: "grey.100", py: 8, mt: 8, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              <Text id="product_list.join_our_newsletter" />
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4} maxWidth="md" mx="auto">
              <Text id="product_list.subscribe_to_receive_updates_on_new_collections_exclusive_offers_and_eyewear_care_tips" />
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", gap: 2, maxWidth: 400, mx: "auto" }}>
              <TextField
                type="email"
                placeholder="Your email address"
                variant="outlined"
                size="medium"
                fullWidth
                sx={{ bgcolor: "white" }}
              />
              <Button
                variant="primary"
                size="large"
              >
                <Text id="product_list.subscribe" />
              </Button>
            </Box>
          </Box>
        </Container>
      </IsLoadingWrapper>
    </Box>
  );
};

export default CollectionList;


