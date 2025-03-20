import { reviews } from "../../database/reviews";

type ProductReviewsProps = {
  star: number;
};

export const ProductReviews = ({ star }: ProductReviewsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-sm">{star} stars</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C8A846]"
          style={{
            width: `${
              (reviews.filter((r) => r.rating === star).length /
                reviews.length) *
              100
            }%`,
          }}
        ></div>
      </div>
      <span className="w-8 text-right text-sm">
        {Math.round(
          (reviews.filter((r) => r.rating === star).length / reviews.length) *
            100
        )}
        %
      </span>
    </div>
  );
};
