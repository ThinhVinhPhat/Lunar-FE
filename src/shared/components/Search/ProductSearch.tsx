import { Product } from "@/shared/types/product";
import { useNavigate } from "react-router-dom";

type ProductSearchProps = {
  products: Product[];
  onClose: () => void;
};

export default function ProductSearch({
  products,
  onClose,
}: ProductSearchProps) {
  const navigate = useNavigate();
  return (
    <>
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            navigate(`/product/${product.slug}`);
            onClose();
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
          <p className="text-[#C8A846] font-semibold">${product.price}</p>
        </div>
      ))}
    </>
  );
}
