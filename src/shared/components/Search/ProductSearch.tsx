import { ProductVariantResponse } from "@/shared/types/product-varitant";
import { Product } from "@/shared/types/product";
import { useNavigate } from "react-router-dom";

// Union type for search results
export type SearchResultItem = Product | ProductVariantResponse;

// Type guard functions
const isProduct = (item: SearchResultItem): item is Product => {
  return 'variants' in item;
};

const isProductVariant = (item: SearchResultItem): item is ProductVariantResponse => {
  return 'product' in item && 'color' in item;
};

type ProductSearchProps = {
  products: SearchResultItem[];
  onClose: () => void;
};

export default function ProductSearch({
  products,
  onClose,
}: ProductSearchProps) {
  const navigate = useNavigate();
  
  const renderSearchItem = (item: SearchResultItem) => {
    if (isProduct(item)) {
      // Render Product
      return (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            navigate(`/product/${item.slug}`);
            onClose();
          }}
        >
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Product</span>
            {item.variants && item.variants.length > 0 && (
              <span className="text-[#C8A846] font-semibold">
                ${Math.min(...item.variants.map(v => v.price))}+
              </span>
            )}
          </div>
        </div>
      );
    } else if (isProductVariant(item)) {
      // Render ProductVariant
      return (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            navigate(`/product/${item.slug}`);
            onClose();
          }}
        >
          <img
            src={item.images[0]}
            alt={`${item.product.name} - ${item.color}`}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <h3 className="font-medium text-gray-900 mb-2">
            {item.product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 capitalize">{item.color}</span>
            <span className="text-[#C8A846] font-semibold">${item.price}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {products.map((item) => renderSearchItem(item))}
    </>
  );
}
