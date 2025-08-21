import { CommentType } from "@/types/review";
import { renderStars } from "./renderStar";

type props = {
  reviews: CommentType[];
};

export const calculateStar = ({ reviews }: props) => {
  if (!reviews) return { averageRating: 0, starRender: renderStars(0) };

  const averageRating =
    reviews?.reduce(
      (acc: number, review: CommentType) => acc + Number(review?.rate),
      0
    ) / reviews?.length;

  const starRender = renderStars(averageRating);

  return {
    averageRating,
    starRender,
  };
};
