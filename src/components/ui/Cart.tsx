import { enqueueSnackbar } from "notistack";
import { deleteOrderDetail } from "../../api/service/order.service";
import { useContextProvider } from "../../hooks/useContextProvider";
import { OrderDetail } from "../../types/order";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { createPayment } from "../../api/service/payment.service";
import { useGetUser } from "../../../src/hooks/queryClient/query/user";
import CartContent from "../cart/CartContent";
import CartButton from "../cart/CartButton";
import { useGetOrderDetail } from "../../hooks/queryClient/query/order/use-get-detail";
import { useUpdateOrder } from "../../hooks/queryClient/mutator/order/order";
import Text from "../wrapper/Text";

type CartProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Cart: React.FC<CartProps> = ({ isOpen, onClose }: CartProps) => {
  const [subtotal, setSubtotal] = useState(0);
  const { cart, setCartItems, cartItems, setCart } = useContextProvider();
  const { data: me } = useGetUser();
  const hasValidInfo = me?.address && me?.phone;
  const isCartEmpty = cartItems.length === 0;
  const { refetch } = useGetOrderDetail(cart?.id || "");
  const { mutateAsync: updateOrder } = useUpdateOrder();

  useEffect(() => {
    setCartItems(cart?.orderDetails || []);
    calculateSubtotal(cart?.orderDetails || []);
  }, [cart, setCartItems, setCart]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const calculateSubtotal = (items: OrderDetail[]) => {
    const total = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const toggleCart = async () => {
    try {
      const paymentData = await createPayment(cart?.id);
      window.location.href = paymentData.link;
    } catch (error) {
      enqueueSnackbar("Error creating payment", {
        variant: "error",
      });
    }
    onClose();
  };

  const removeItem = async (id: string) => {
    try {
      const updatedItems = cartItems.filter((item) => item.id !== id);
      await deleteOrderDetail(id);
      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
      const { data: updatedOrder } = await refetch();
      setCart(updatedOrder?.data);
      enqueueSnackbar("Product removed from cart", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error removing product from cart", { variant: "error" });
    }
  };

  const updateQuantity = async (id: string, productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    await updateOrder({
      orderDetailId: id,
      orderId: cart?.id || "",
      productId: productId,
      quantity: newQuantity,
    });
    setCartItems(updatedItems);
    calculateSubtotal(updatedItems);
  };

  const freeShippingThreshold = 99;
  const freeShippingRemaining = freeShippingThreshold - subtotal;

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                <Text id="cart.your_cart" />
              </h2>
              <button
                onClick={() => onClose()}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close cart"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4 bg-gray-50">
              {freeShippingRemaining > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <Text id="cart.youre" />{" "}
                    <span className="font-bold">
                      ${freeShippingRemaining.toFixed(2)}
                    </span>{" "}
                    <Text id="cart.away_from_free_us_shipping" />
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#C8A846] h-2 rounded-full"
                      style={{
                        width: `${(subtotal / freeShippingThreshold) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-green-600 font-medium">
                  🎉 <Text id="cart.youve_qualified_for_free_us_shipping" />!
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <CartContent
                cartItems={cartItems}
                hasValidInfo={hasValidInfo}
                isCartEmpty={isCartEmpty}
                removeItem={removeItem}
                toggleCart={toggleCart}
                updateQuantity={updateQuantity}
                onClose={onClose}
              />
            </div>

            <CartButton
              cartItems={cartItems}
              onClose={onClose}
              subtotal={subtotal}
              toggleCart={toggleCart}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
