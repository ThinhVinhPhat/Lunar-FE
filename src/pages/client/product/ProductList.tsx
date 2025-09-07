import { useState } from "react";
import usePagination from "@/shared/hooks/usePagination";
import FilterDrawer from "@/components/product/Filter/FilterDrawer";
import { useParams } from "react-router-dom";
import { Pagination } from "@/shared/components/Pagination";
import Text from "@/shared/components/wrapper/Text";
import { useProductAction } from "@/shared/hooks/useProductAction";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { Button } from "@/shared/components/Button";
import ProductItem from "@/components/product/ProductItem";

import {
  Box,
  Typography,
  Container,
  TextField,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const ProductList = () => {
  const { type } = useParams();
  const { page, handlePageChange } = usePagination();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { products, isLoading, total, handleFavoriteProduct } = useProductAction(page, 20, null);

  const imageUrl = type === "men"
    ? "https://shwoodshop.com/cdn/shop/collections/f0395074198cd18e070e805ac2f80682_99a27b1f-60f2-4f74-afe7-061d0b89fa36.jpg?v=1658366448&width=1920"
    : "https://shwoodshop.com/cdn/shop/collections/702d24259e3886ae6e511220fd938f2e.jpg?v=1658272432&width=1920";

  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh", pt: 8 }}>
      <Box sx={{ position: "relative", bgcolor: "grey.900", color: "white" }}>
        <Box
          component="img"
          src={imageUrl}
          alt="Eyewear Collection"
          sx={{ width: "100%", height: { xs: 256, md: 384 }, objectFit: "cover", opacity: 0.7 }}
        />

        <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 2, textAlign: "center" }}>
          <Typography variant="h3" component="h1" fontWeight="bold" mb={2}>
            <Text id="product_list.premium_eyewear_collection" />
          </Typography>
          <Typography variant="h6" maxWidth="md">
            <Text id="product_list.discover_our_handcrafted_frames_made_from_sustainable_materials" />
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
                    <Text id="product_list.all_products" />
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

                <Pagination
                  productCount={total}
                  currentPage={page}
                  onSetPage={handlePageChange}
                  limit={20}
                />
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

export default ProductList;


