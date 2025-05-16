import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Product } from "../../types/product";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ProductItemProps = {
  product: Product;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  handleFavoriteProduct: (id: string) => void;
};
function ProductItem({
  product,
  hoveredId,
  setHoveredId,
  handleFavoriteProduct,
}: ProductItemProps) {
  const navigate = useNavigate();
  const colors = product.productCategories.filter(
    (item) => item.categoryDetails.name === "Color"
  );
  const { t } = useTranslation();

  return (
    <div
      key={product.id}
      className="group p-4 relative overflow-hidden rounded-lg"
      onMouseEnter={() => setHoveredId(product.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
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
            {t("product_item.new")}
          </span>
        )}
        {product.discount_percentage > 0 && (
          <span className="absolute top-6 right-6 bg-red-500 text-white px-3 py-1 rounded">
            {t("product_item.save")} {product.discount_percentage}%
          </span>
        )}
        <button
          onClick={() => handleFavoriteProduct(product.id)}
          className="absolute bottom-6 right-6 p-2 rounded-full transition-all duration-300 shadow-md"
          aria-label={
            product.isFavorite ? t("product_item.remove_from_favorites") : t("product_item.add_to_favorites")
          }
        >
          <FontAwesomeIcon
            icon={faHeart}
            className={clsx("text-lg", {
              "text-red-500": product.isFavorite,
              "text-gray-400": !product.isFavorite,
            })}
          />
          <span
            className={clsx("absolute inset-0 rounded-full -z-10", {
              "bg-white": product.isFavorite,
              "bg-[#C8A846] hover:bg-[#D9B95B]": !product.isFavorite,
            })}
          ></span>
        </button>

        <div className="absolute  bottom-0 left-0 right-0 bg-black bg-opacity-0 group-hover:bg-opacity-20  transition-all duration-300">
          <div className="p-6 flex flex-col gap-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => navigate(`/product/${product.slug}`)}
              className="w-full bg-white text-black py-3 rounded-md hover:bg-[#C8A846] hover:text-white transition-colors duration-300"
            >
              {t("product_item.quick_shop")}
            </button>
            <button
              onClick={() => handleFavoriteProduct(product.id)}
              className="w-full bg-white text-black py-3 rounded-md hover:bg-[#C8A846] hover:text-white transition-colors duration-300"
            >
              {product.isFavorite ? t("product_item.remove_from_favorites") : t("product_item.add_to_favorites")}
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
                {Math.round(
                  Number(product.price) *
                    (1 - product.discount_percentage / 100)
                )}
              </span>
              <span className="text-gray-400 line-through text-sm">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-[#2c2c2c] font-medium">${product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
