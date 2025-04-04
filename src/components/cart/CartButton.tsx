import { OrderDetail } from "@/types/order";

type Prop = {
  cartItems: OrderDetail[];
  subtotal: number;
  toggleCart: () => void;
  onClose: () => void;
};

function CartButton({ cartItems, subtotal, toggleCart, onClose }: Prop) {
  return (
    cartItems.length > 0 && (
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Shipping and taxes calculated at checkout.
        </p>
        <button
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#C8A846] hover:bg-[#ae923e] transition-colors"
          onClick={toggleCart}
        >
          Checkout
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-[#C8A846] hover:underline text-sm font-medium"
            onClick={() => onClose()}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  );
}

export default CartButton;
