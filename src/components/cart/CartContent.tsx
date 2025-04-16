import { OrderDetail } from "@/types/order";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

type CartType = {
  hasValidInfo: boolean;
  isCartEmpty: boolean;
  updateQuantity: (id: string, quantity: number) => void;
  cartItems: OrderDetail[];
  toggleCart: () => void;
  removeItem: (id: string) => void;
  onClose: () => void;
};

function CartContent({
  hasValidInfo,
  isCartEmpty,
  updateQuantity,
  cartItems,
  removeItem,
  onClose,
}: CartType) {
  const navigate = useNavigate();
  const cartContent = isCartEmpty ? (
    <div className="text-center py-8">
      <FiShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500 mb-4">You have no items in your cart</p>
      <button
        onClick={() => {
          onClose();
        }}
        className="text-[#C8A846] hover:underline font-medium"
      >
        Continue Shopping
      </button>
    </div>
  ) : (
    <ul className="divide-y divide-gray-200">
      {cartItems.map((item) => (
        <li key={item.id} className="py-4 flex">
          {/* Product Image */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img
              src={item?.product?.images?.[0]}
              alt={item?.product?.name || "Product image"}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Product Details */}
          <div className="ml-4 flex flex-1 flex-col">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <h3>
                <Link
                  to={`/product/${item.id}`}
                  className="hover:text-[#C8A846]"
                >
                  {item?.product_name}
                </Link>
              </h3>
              <p className="ml-4">
                ${Number(item?.product?.price || 0 * item.quantity).toFixed(2)}
              </p>
            </div>

            <div className="flex flex-1 items-end justify-between text-sm">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <FiTrash2 className="mr-1" /> Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      {!hasValidInfo ? (
        <div className="text-center py-8 bg-yellow-100 text-yellow-700 p-4 rounded-md">
          <p className="font-medium">
            Please update your address and phone number to proceed with the
            order.
          </p>
          <button
            onClick={() => {
              navigate("/profile");
              onClose();
            }}
            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Update Now
          </button>
        </div>
      ) : (
        cartContent
      )}
    </>
  );
}

export default CartContent;
