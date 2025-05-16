import { useGetFavoriteProducts } from "../../../hooks/queryClient/query/product/favorite-product";
import Text from "../../../components/wrapper/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { CommentSort, CommentType } from "../../../types/review";
import { useGetCommentUser } from "../../../hooks/queryClient/query/comment/get-comment-user";
import { useState } from "react";
import IsLoadingWrapper from "../../../components/wrapper/isLoading";

function UserProduct() {
  const { data: favoriteProducts, isLoading } = useGetFavoriteProducts();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const offset = (page - 1) * 5;
  const [sort, setSort] = useState(CommentSort.NEWEST);
  const { data: userReviews, isLoading: isLoadingReviews } = useGetCommentUser({
    offset: offset,
    limit: page * 5,
    sort: sort,
  });

  console.log(favoriteProducts);
  return (
    <div className="border-t border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#C8A846] mb-4">
            <Text id="user_product.favorite_products" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-[700px] gap-4 relative">
            <IsLoadingWrapper isLoading={isLoading}>
              {favoriteProducts && favoriteProducts.length > 0 ? (
                <div className="col-span-full overflow-hidden w-[880px]">
                  <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {favoriteProducts.map((item: any) => (
                      <div
                        key={item.product.id}
                        className="group p-4 relative overflow-hidden rounded-lg border border-gray-200 min-w-[280px] mr-4 snap-start"
                      >
                        <div className="relative aspect-[1080/614] overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                          />
                          {item.product.discount_percentage > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                              {item.product.discount_percentage}% OFF
                            </span>
                          )}
                          <button
                            // onClick={() => handleRemoveFavorite(product.id)}
                            className="absolute top-2 left-2 p-2 rounded-full bg-white shadow-md"
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-red-500 text-sm"
                            />
                          </button>
                        </div>
                        <div className="pt-3">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                              {item.product.discount_percentage > 0 ? (
                                <>
                                  <span className="text-red-600 font-medium text-sm">
                                    $
                                    {(
                                      Number(item.product.price) *
                                      (1 -
                                        item.product.discount_percentage / 100)
                                    ).toFixed(2)}
                                  </span>
                                  <span className="text-gray-400 line-through text-xs">
                                    ${item.product.price}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-900 font-medium text-sm">
                                  ${item.product.price}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                navigate(`/product/${item.product.slug}`)
                              }
                              className="text-xs text-[#C8A846] hover:underline"
                            >
                              <Text id="user_product.view_details" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Text id="user_product.favorite_at" />
                          {": "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="col-span-full bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">
                    <Text id="user_product.you_dont_have_any_favorite_products_yet" />
                  </p>
                  <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
                    <Text id="user_product.explore_products" />
                  </button>
                </div>
              )}
            </IsLoadingWrapper>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#C8A846] mb-4">
            <Text id="user_product.your_reviews" />
          </h3>
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
        <IsLoadingWrapper isLoading={isLoadingReviews}>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {userReviews && userReviews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {userReviews.map((review: CommentType) => (
                  <div key={review.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={review.product.images[0]}
                          alt={review.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 hover:text-[#C8A846]">
                            {review.product.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex text-[#C8A846] mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>
                              {i < review.rate ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              )}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-gray-600 text-sm">
                          {review.content}
                        </p>
                        <button
                          onClick={() =>
                            navigate(`/product/${review.product.slug}`)
                          }
                          className="mt-2 text-xs text-[#C8A846] hover:underline"
                        >
                          <Text id="user_product.view_product" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-600">
                  <Text id="user_product.you_havent_reviewed_any_products_yet" />
                </p>
                <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
                  <Text id="user_product.view_purchased_products" />
                </button>
              </div>
            )}
          </div>
        </IsLoadingWrapper>
      </div>
    </div>
  );
}

export default UserProduct;
