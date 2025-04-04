import { ProductType } from "@/types/product";
import { Link } from "react-router-dom";

type ProductItemProps = {
  product: ProductType;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
};
function ProductItem({ product, hoveredId, setHoveredId }: ProductItemProps) {
  const colors = product.productCategories.filter(
    (item) => item.categoryDetails.name === "Color"
  );
  return (
    <div
      key={product.id}
      className="group p-4 relative overflow-hidden rounded-lg"
      onMouseEnter={() => setHoveredId(product.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-[1080/614] overflow-hidden">
          <img
            src={
              hoveredId === product.id && product.images[1]
                ? product.images[1]
                : product.images[0]
            }
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute top-6 left-6 bg-[#C8A846] text-white px-3 py-1 rounded">
              New!
            </span>
          )}
          {product.discount_percentage > 0 && (
            <span className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1 rounded">
              Save {product.discount_percentage}%
            </span>
          )}

          <div className="absolute  bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-20  transition-all duration-300">
            <div className="p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button className="w-full bg-white text-black py-3 rounded-md hover:bg-[#C8A846] hover:text-white transition-colors duration-300">
                Quick Shop
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <h3 className="text-lg font-medium mb-1 text-[#2c2c2c] group-hover:text-[#C8A846] transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex justify-center gap-2 mb-2">
            {colors?.map((colorItem) => (
              <div
                key={colorItem.id}
                className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition-transform duration-200"
                style={{ backgroundColor: colorItem.categoryDetails.name }}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2">
            {product.discount_percentage > 0 ? (
              <>
                <span className="text-red-500 font-medium">
                  $
                  {Number(product.price) *
                    (1 - product.discount_percentage / 100)}
                </span>
                <span className="text-gray-400 line-through text-sm">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-[#2c2c2c] font-medium">
                ${product.price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductItem;
