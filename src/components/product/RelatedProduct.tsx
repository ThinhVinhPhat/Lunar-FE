import { Product } from "@/shared/types/product";
import { Link } from "react-router-dom";
import IsLoadingWrapper from "../../shared/components/wrapper/isLoading";

type RelatedProductProps = {
  categoryProducts: Product[];
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
        <IsLoadingWrapper isLoading={isLoading}>
          <div className="flex flex-wrap gap-6 w-full">
            <div className="flex flex-wrap gap-6 w-full">
              {categoryProducts
                ?.slice(0, 3)
                .sort(() => Math.random() - 0.5)
                .map((product: Product) => (
                  <Link key={product.id} to={`/product/${product.slug}`}>
                    <div className="relative  mb-4 overflow-hidden rounded-lg">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-[350px]  object-cover group-hover:scale-105 transition-transform duration-300"
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
                ))}
            </div>
          </div>
        </IsLoadingWrapper>
      </div>
    </div>
  );
};
