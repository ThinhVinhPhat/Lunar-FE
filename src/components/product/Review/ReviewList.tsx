import { useGetCommentProduct } from "../../../hooks/queryClient/query/comment/get-comment-product";
import ProductReviews from "./ProductReview";
import { CommentSort, CommentType } from "../../../types/review";
import CommentModal from "../../modal/AddComment";
import { useEffect, useState } from "react";
import { StartReviews } from "./StarReviews";
import { renderStars } from "../../../ultis/renderStar";
import { useCreateComment } from "../../../hooks/queryClient/mutator/comment/create-comment";
import { calculateStar } from "../../../ultis/calculateStar";
import Pagination from "../../admin/pagination";
import { useDeleteComment } from "../../../hooks/queryClient/mutator/comment/delete-comment";

type ReviewType = {
  productId: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

function ReviewList({ productId, setIsOpen, isOpen }: ReviewType) {
  const [sort, setSort] = useState(CommentSort.NEWEST);
  const { mutateAsync: createComment } = useCreateComment();
  const { mutateAsync: deleteComment } = useDeleteComment();
  const { data: reviews, refetch: refetchComment } = useGetCommentProduct(
    productId || "",
    {
      limit: 10,
      offset: 0,
      sort: sort,
    }
  );
  const { averageRating } = calculateStar(reviews);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / 10);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    if (!isOpen) {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const addComment = async (data: any) => {
    await createComment({
      productId: productId,
      data: data,
    });
    setIsOpen(false);
    refetchComment();
  };

  const handleDeleteComment = async (id: string) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await deleteComment(id);
      refetchComment();
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-2xl">{renderStars(averageRating)}</div>
            <span className="text-lg">
              {averageRating.toFixed(1)} out of {reviews.length} reviews
            </span>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <StartReviews key={star} star={star} reviews={reviews} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label
              htmlFor="sort-reviews"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort by
            </label>
            <select
              onChange={(e) => setSort(e.target.value as CommentSort)}
              id="sort-reviews"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
            >
              <option value={CommentSort.NEWEST}>Most Recent</option>
              <option value={CommentSort.HIGH_RATE}>Highest Rating</option>
              <option value={CommentSort.LOW_RATE}>Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {reviews.map((review: CommentType) => (
          <ProductReviews review={review} onDelete={handleDeleteComment} />
        ))}
      </div>
      <Pagination
        products={reviews}
        filteredProducts={reviews}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
      />

      <CommentModal
        onSubmit={addComment}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default ReviewList;
