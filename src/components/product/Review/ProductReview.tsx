import { CommentType } from "@/types/review";
import { renderStars } from "../../../ultis/renderStar";
import { useGetUser } from "../../../hooks/queryClient/query/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type ProductReviewsProps = {
  review: CommentType;
  onDelete: (id: string) => void;
};

function ProductReviews({ review, onDelete }: ProductReviewsProps) {
  const { data: user } = useGetUser();
  return (
    <div
      key={review.id}
      className="border-b border-gray-200 pb-6 flex flex-row items-start justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(review.rate)}</div>
        </div>
        <p className="text-sm text-gray-600 mb-2">{review.content}</p>
        {review.images && review.images.length > 0 && (
          <div className="mt-3 mb-4">
            <div className="grid grid-cols-3 gap-2">
              {review.images.map((image, index) => (
                <div key={index} className="relative h-24 rounded overflow-hidden">
                  <img
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span className="font-medium">
            {review.user.firstName} {review.user.lastName}
          </span>{" "}
          - {new Date(review.createdAt).toDateString()}
        </p>
      </div>
      {user?.id === review.user.id && (
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => onDelete(review.id)}
          className="cursor-pointer text-red-500"
        />
      )}
    </div>
  );
}

export default ProductReviews;
