import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Product } from "@/shared/types/product";
import { ProductVariantResponse } from "@/shared/types/product-varitant";
import { useFavoriteProductVariant } from "@/lib/hooks/queryClient/mutator/product-variant/product-variant.mutator";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { enqueueSnackbar } from "notistack";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { Button } from "@/shared/components/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type ProductItemProps = {
  product: Product;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  handleFavoriteProduct: (id: string) => void;
};

function ProductItem({
  product,
  hoveredId,
  setHoveredId,
  handleFavoriteProduct,
}: ProductItemProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: user } = useGetUser();
  const { mutateAsync: favoriteProductVariant } = useFavoriteProductVariant();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantResponse | null>(null);

  useEffect(() => {
    if (product?.variants && product?.variants?.length > 0) {
      setSelectedVariant(product?.variants?.[0]);
    }
  }, [product]);

  const handleVariantClick = useCallback((variant: ProductVariantResponse) => {
    setSelectedVariant(variant);
  }, []);

  const handleFavoriteClick = useCallback(async () => {
    if (!user?.id) {
      enqueueSnackbar("Please login to favorite product", { variant: "error" });
      navigate("/login");
      return;
    }
    
    if (selectedVariant) {
      await favoriteProductVariant(selectedVariant.id);
    } else {
      handleFavoriteProduct(product.id);
    }
  }, [user?.id, selectedVariant, favoriteProductVariant, handleFavoriteProduct, product.id, navigate]);

  const isFavorited = selectedVariant 
    ? selectedVariant.isFavorite
    : product.isFavorite;

  

  const displayImages = selectedVariant?.images || product.images || [];
  const displayPrice = selectedVariant?.price || 0;
  const displayDiscount = selectedVariant?.discount_percentage || 0;
  const displaySlug = selectedVariant?.slug || product.slug;

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 1,
        "&:hover": { boxShadow: 6 },
      }}
      >
      <Box 
      sx={{ position: "relative", aspectRatio: "1080 / 614", overflow: "hidden" }}
        onMouseEnter={() => setHoveredId(product.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <CardMedia
          component="img"
          image={
            hoveredId === product.id && displayImages[1]
              ? displayImages[1]
              : displayImages[0]
          }
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.7s ease-in-out",
            transform: hoveredId === product.id ? "scale(1.05)" : "scale(1)",
          }}
        />

        {product.isNew && (
          <Chip
            label={t("product_item.new")}
            color="primary"
            size="small"
            sx={{ position: "absolute", top: 16, left: 16, bgcolor: "#C8A846" }}
          />
        )}

        {displayDiscount > 0 && (
          <Chip
            label={`${t("product_item.save")} ${displayDiscount}%`}
            color="error"
            size="small"
            sx={{ position: "absolute", top: 16, right: 16 }}
          />
        )}

        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            bgcolor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(200,168,70,0.2)",
            "&:hover": { 
              bgcolor: "#C8A846",
              transform: "scale(1.1)",
              boxShadow: "0 6px 20px rgba(200,168,70,0.4)"
            },
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease-in-out"
          }}
          aria-label={
            isFavorited
              ? t("product_item.remove_from_favorites")
              : t("product_item.add_to_favorites")
          }
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: "#C8A846" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#C8A846" }} />
          )}
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: hoveredId === product.id 
              ? "linear-gradient(180deg, rgba(200,168,70,0) 0%, rgba(200,168,70,0.85) 70%, rgba(200,168,70,0.95) 100%)"
              : "rgba(0,0,0,0)",
            transition: "background 0.4s ease-in-out, height 0.3s ease-in-out, opacity 0.3s ease-in-out",
            height: hoveredId === product.id ? "100%" : "0%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 2,
            opacity: hoveredId === product.id ? 1 : 0,
          }}
        >
          <Box sx={{ mb: 1, width: '100%' }}>
            <Button
              variant="overlay-primary"
              size="medium"
              fullWidth
              onClick={() => navigate(`/product/${displaySlug}`)}
            >
              {t("product_item.quick_shop")}
            </Button>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Button
              variant="overlay-secondary"
              size="medium"
              fullWidth
              onClick={handleFavoriteClick}
            >
              {isFavorited
                ? t("product_item.remove_from_favorites")
                : t("product_item.add_to_favorites")}
            </Button>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ 
        textAlign: "center", 
        pt: 2,
        background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,249,250,1) 100%)",
        borderTop: "1px solid rgba(200,168,70,0.1)"
      }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 1 }}>
          {product.variants?.map((variant) => (
            <Box
              key={variant.id}
              onClick={() => handleVariantClick(variant)}
              sx={{
                border: selectedVariant?.id === variant.id ? "2px solid #C8A846" : "1px solid #e0e0e0",
                borderRadius: "6px",
                width: "40px",
                height: "40px",
                p: "2px",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  border: "2px solid #C8A846",
                  transform: "scale(1.05)"
                }
              }}
            >
              <Box
                component="img"
                src={variant.images?.[0] || product.images?.[0]}
                alt={`${product.name} - ${variant.color}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px"
                }}
              />
            </Box>
          ))}
        </Box>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: "medium",
            mb: 0.5,
            color: "#2c2c2c",
            "&:hover": { color: "#C8A846" },
            transition: "color 0.3s ease-in-out",
            fontSize: {
              xs: product?.name?.length > 20 ? '1rem' : product?.name?.length > 15 ? '1.1rem' : '1.2rem',
              sm: product?.name?.length > 25 ? '1rem' : product?.name?.length > 20 ? '1.1rem' : '1.2rem',
              md: product?.name?.length > 30 ? '1rem' : product?.name?.length > 25 ? '1.1rem' : '1.2rem'
            },
            lineHeight: 1.3,
            height: '2.6em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer'
          }}
          onClick={() => navigate(`/product/${displaySlug}`)}
        >
          {product.name}
        </Typography>

        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 1,
          mt: 1,
          p: 1,
          borderRadius: 2,
          background: "rgba(200,168,70,0.05)"
        }}>
          {displayDiscount > 0 ? (
            <>
              <Typography variant="body1" color="error" fontWeight="medium">
                ${Math.round(
                  Number(displayPrice) *
                    (1 - displayDiscount / 100)
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                ${displayPrice}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" sx={{ color: "#C8A846", fontWeight: "bold", fontSize: "1.1rem" }}>${displayPrice}</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductItem;


