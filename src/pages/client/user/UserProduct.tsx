import { useGetFavoriteProducts } from "@/lib/hooks/queryClient/query/product/product.query";
import Text from "@/shared/components/wrapper/Text";
import { useNavigate } from "react-router-dom";
import { CommentSort, CommentType } from "@/shared/types/review";
import { useGetCommentUser } from "@/lib/hooks/queryClient/query/comment/comment.query";
import { useState } from "react";
import usePagination from "@/shared/hooks/usePagination";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { Pagination } from "@/shared/components/Pagination";
import { FavoriteProductInterface } from "@/shared/types/product";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  IconButton,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Visibility,
  ShoppingCart,
  Star,
  RateReview,
} from "@mui/icons-material";
import { useFavoriteProduct } from "@/lib/hooks/queryClient/mutator/product/product.mutator";


function UserProduct() {
  const { data: favoriteProducts, isLoading } = useGetFavoriteProducts();
  const { mutateAsync: favoriteProduct } = useFavoriteProduct();
  const navigate = useNavigate();

  const { page, handlePageChange } = usePagination();
  const [sort, setSort] = useState(CommentSort.NEWEST);
  const {
    data: userReviews,
    isLoading: isLoadingReviews,
    total,
  } = useGetCommentUser({
    page: page,
    limit: 10,
    sort: sort,
  });

  const handleFavorite = async (id: string) => {
    try {
      await favoriteProduct(id);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Box>
      <Box className="flex flex-col lg:flex-row gap-6">
        <Box className="flex-1">
          <Typography variant="h5" className="font-bold text-[#C8A846] mb-4 flex items-center gap-2">
            <Favorite />
            <Text id="user_product.favorite_products" />
          </Typography>
          
          <IsLoadingWrapper isLoading={isLoading}>
            {favoriteProducts && favoriteProducts.length > 0 ? (
              <Box className="max-h-[600px] overflow-y-auto pr-2">
                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteProducts.slice(0, 6).map((item: FavoriteProductInterface) => (
                    <Card key={item.product.id} className="hover:shadow-md transition-shadow group">
                      <Box className="flex gap-3 p-3">
                        <Box className="relative w-20 h-20 flex-shrink-0">
                          <CardMedia
                            component="img"
                            sx={{ width: 80, height: 80 }}
                            image={item.product.images[0]}
                            alt={item.product.name}
                            className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.product.discount_percentage > 0 && (
                            <Chip
                              label={`${item.product.discount_percentage}%`}
                              color="error"
                              size="small"
                              sx={{ position: 'absolute', top: -8, right: -8, fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                        <Box className="flex-1 min-w-0">
                          <Typography variant="subtitle2" className="font-medium mb-1 line-clamp-2">
                            {item.product.name}
                          </Typography>
                          <Box className="flex items-center gap-1 mb-1">
                            {item.product.discount_percentage > 0 ? (
                              <>
                                <Typography variant="body2" className="text-[#C8A846] font-bold">
                                  $
                                  {(
                                    Number(item.product.price) *
                                    (1 - item.product.discount_percentage / 100)
                                  ).toFixed(2)}
                                </Typography>
                                <Typography variant="caption" className="text-gray-400 line-through">
                                  ${item.product.price}
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="body2" className="text-[#C8A846] font-bold">
                                ${item.product.price}
                              </Typography>
                            )}
                          </Box>
                          <Box className="flex justify-between items-center">
                            <Typography variant="caption" color="text.secondary">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </Typography>
                            <Box className="flex gap-1">
                              <IconButton
                                size="small"
                                onClick={() => handleFavorite(item.product.id)}
                                className="text-red-500"
                              >
                                <Favorite fontSize="small" sx={{ color: "red" }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/product/${item.product.slug}`)}
                                className="text-[#C8A846]"
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Box>
                {favoriteProducts.length > 6 && (
                  <Box className="text-center mt-3">
                    <Button
                      variant="text"
                      size="small"
                      className="text-[#C8A846]"
                    >
                      View All ({favoriteProducts.length})
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Card elevation={1} className="text-center py-8">
                <CardContent>
                  <FavoriteBorder className="text-gray-300 mb-3" sx={{ fontSize: 48 }} />
                  <Typography variant="h6" color="text.secondary" className="mb-2">
                    <Text id="user_product.you_dont_have_any_favorite_products_yet" />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-3">
                    Discover amazing products and add them to your favorites
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    className="bg-[#C8A846] hover:bg-[#ae923e]"
                    startIcon={<ShoppingCart />}
                  >
                    <Text id="user_product.explore_products" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </IsLoadingWrapper>
        </Box>

        <Box className="flex-1">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h5" className="font-bold text-[#C8A846] flex items-center gap-2">
              <RateReview />
              <Text id="user_product.your_reviews" />
            </Typography>
            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sort}
                label="Sort by"
                onChange={(e) => setSort(e.target.value as CommentSort)}
              >
                <MenuItem value={CommentSort.NEWEST}>Recent</MenuItem>
                <MenuItem value={CommentSort.HIGH_RATE}>High Rating</MenuItem>
                <MenuItem value={CommentSort.LOW_RATE}>Low Rating</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <IsLoadingWrapper isLoading={isLoadingReviews}>
            {userReviews && userReviews.length > 0 ? (
              <Box className="max-h-[600px] overflow-y-auto pr-2">
                <Stack spacing={2}>
                  {userReviews.slice(0, 5).map((review: CommentType) => (
                    <Card key={review.id} elevation={1} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <Box className="flex gap-3">
                          <CardMedia
                            component="img"
                            sx={{ width: 60, height: 60 }}
                            image={review.product.images[0]}
                            alt={review.product.name}
                            className="rounded-lg object-cover"
                          />
                          <Box className="flex-1 min-w-0">
                            <Box className="flex justify-between items-start mb-1">
                              <Typography variant="subtitle2" className="font-medium hover:text-[#C8A846] cursor-pointer line-clamp-1">
                                {review.product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            
                            <Rating
                              value={review.rate}
                              readOnly
                              size="small"
                              className="mb-1"
                              sx={{ color: '#C8A846' }}
                            />
                            
                            <Typography variant="body2" color="text.secondary" className="mb-2 line-clamp-2">
                              {review.content}
                            </Typography>
                            
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => navigate(`/product/${review.product.slug}`)}
                              className="text-[#C8A846] p-0 min-w-0"
                              startIcon={<Visibility fontSize="small" />}
                            >
                              <Text id="user_product.view_details" />
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
                
                {userReviews.length > 10 && (
                  <Box className="text-center mt-3">
                    <Button
                      variant="text"
                      size="small"
                      className="text-[#C8A846]"
                    >
                      View All Reviews ({total})
                    </Button>
                  </Box>
                )}
                
           
                  <Box className="flex justify-center mt-3">
                    <Pagination
                      currentPage={page}
                      limit={10}
                      onSetPage={handlePageChange}
                      productCount={total}
                    />
                  </Box>
              </Box>
            ) : (
              <Card elevation={1} className="text-center py-8">
                <CardContent>
                  <Star className="text-gray-300 mb-3" sx={{ fontSize: 48 }} />
                  <Typography variant="h6" color="text.secondary" className="mb-2">
                    <Text id="user_product.you_havent_reviewed_any_products_yet" />
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-3">
                    Share your experience with products you've purchased
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    className="bg-[#C8A846] hover:bg-[#ae923e]"
                    startIcon={<ShoppingCart />}
                  >
                    <Text id="user_product.view_purchased_products" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </IsLoadingWrapper>
        </Box>
      </Box>
    </Box>
  );
}

export default UserProduct;
