import { ProductsType, ProductType } from "@/types/product";
import { Link } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";

type RelatedProductProps = {
  categoryProducts: ProductsType;
  isLoading: boolean;
};

export const RelatedProduct = ({
  categoryProducts,
  isLoading,
}: RelatedProductProps) => {
  return (
    <div className="mt-16 ">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        You May Also Like
      </h2>
      <div className="flex flex-wrap gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner />
          </div>
        ) : (
          categoryProducts?.data?.slice(0, 3).map((product: ProductType) => (
            <div key={product.id} className="group">
              <Link to={`/product/${product.slug}`}>
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className=" aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-[#C8A846] text-white px-3 py-1 text-sm rounded">
                      New
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-gray-600">${product.price}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
