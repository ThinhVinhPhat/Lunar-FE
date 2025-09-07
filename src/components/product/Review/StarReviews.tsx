import { CommentType } from "@/shared/types/review";

type StartReviewsProps = {
  reviews: CommentType[];
  star: number;
};

export const StartReviews = ({ star, reviews }: StartReviewsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-sm">{star} stars</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        {reviews.length > 0 ? (
          <div
            className="h-full bg-[#C8A846]"
            style={{
              width: `${
                (reviews.filter((r) => r.rate === star).length /
                  reviews.length) *
                100
              }%`,
            }}
          ></div>
        ) : (
          <div className="h-full bg-[#C8A846] w-full"></div>
        )}
      </div>
      <span className="w-8 text-right text-sm">
        {reviews.length > 0
          ? Math.round(
              (reviews.filter((r) => r.rate === star).length / reviews.length) *
                100
            )
          : 0}
        %
      </span>
    </div>
  );
};
