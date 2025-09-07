import { CommentType } from "@/shared/types/review";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";

import {
  Box,
  Typography,
  Rating,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type ProductReviewsProps = {
  review: CommentType;
  onDelete: (id: string) => void;
};

function ProductReviews({ review, onDelete }: ProductReviewsProps) {
  const { data: user } = useGetUser();

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        pb: 3,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Rating value={review.rate} readOnly precision={0.5} />
        </Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {review.content}
        </Typography>
        {review.images && review.images.length > 0 && (
          <ImageList sx={{ width: 300, height: 150 }} cols={3} rowHeight={100}>
            {review.images.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  loading="lazy"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
        <Typography variant="caption" color="text.disabled" mt={1}>
          <Typography component="span" fontWeight="medium">
            {review.user.firstName} {review.user.lastName}
          </Typography>{" "}
          - {new Date(review.createdAt).toDateString()}
        </Typography>
      </Box>
      {user?.id === review.user.id && (
        <IconButton onClick={() => onDelete(review.id)} color="error">
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default ProductReviews;


