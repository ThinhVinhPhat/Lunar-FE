import { OrderDetail } from "@/types/order";
import Text from "../wrapper/Text";

type Prop = {
  cartItems: OrderDetail[];
  subtotal: number;
  finalTotal: number;
  toggleCart: () => void;
  onClose: () => void;
};

function CartButton({
  cartItems,
  subtotal,
  finalTotal,
  toggleCart,
  onClose,
}: Prop) {
  return (
    cartItems.length > 0 && (
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <Text id="cart.subtotal" />
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <Text id="cart.final_total" />
          <p>${finalTotal.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          <Text id="cart.shipping_and_taxes_calculated_at_checkout" />
        </p>
        <button
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#C8A846] hover:bg-[#ae923e] transition-colors"
          onClick={toggleCart}
        >
          <Text id="cart.checkout" />
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-[#C8A846] hover:underline text-sm font-medium"
            onClick={() => onClose()}
          >
            <Text id="cart.continue_shopping" />
          </button>
        </div>
      </div>
    )
  );
}

export default CartButton;
