import { enqueueSnackbar } from "notistack";
import { deleteOrderDetail } from "@/lib/api/service/order.service";
import { useContextProvider } from "@/shared/hooks/useContextProvider";
import { OrderDetail } from "@/shared/types/order";
import React, { useState, useEffect } from "react";
import CartContent from "./CartContent";
import CartButton from "./CartButton";
import { useGetOrderDetail } from "@/lib/hooks/queryClient/query/order/order.query";
import { useUpdateOrder } from "@/lib/hooks/queryClient/mutator/order/order";
import Text from "../../shared/components/wrapper/Text";

import { Drawer, Box, Typography, IconButton, Divider, Collapse, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { createPayment } from "@/lib/api/service/payment.service";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import CartDiscount from "./CartDiscount";
import { useGetDiscountsByUser } from "@/lib/hooks/queryClient/query/discount/discount.query";
import { useApplyDiscount, useDeleteDiscountFromOrder } from "@/lib/hooks/queryClient/mutator/discount/discount.mutaition";
import CartHeader from "./CartHeader";

type CartProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Cart: React.FC<CartProps> = ({ isOpen, onClose }: CartProps) => {
  const [subtotal, setSubtotal] = useState(0);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const { cart, setCartItems, cartItems, setCart } = useContextProvider();
  const { data: me } = useGetUser();
  const hasValidInfo = me?.address && me?.phone;
  const isCartEmpty = cartItems.length === 0;
  const { refetch } = useGetOrderDetail(cart?.id || "");
  const { mutateAsync: updateOrder } = useUpdateOrder();
  
  // discount
  const { data: discounts } = useGetDiscountsByUser();
  const { mutateAsync: applyDiscountFromOrder } = useApplyDiscount();
  const { mutateAsync: deleteDiscountFromOrder } = useDeleteDiscountFromOrder();

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

  const handleCheckout = async () => {
    try {
      const paymentData = await createPayment(cart?.id);
      window.location.href = paymentData.link;
    } catch {
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
    } catch {
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

  const handleApplyDiscount = async (discountId: string) => {
    try {      
      await applyDiscountFromOrder({
        discountId,
        orderId: cart?.id ?? ""
      });
      const { data: updatedOrder } = await refetch();
      setCart(updatedOrder?.data);
    } catch {
      enqueueSnackbar("Error applying discount", { variant: "error" });
    }
  };

  const handleDeleteDiscountFromOrder = async (discountId: string) => {
    try {
      await deleteDiscountFromOrder({
        discountId,
        orderId: cart?.id ?? ""
      });
      enqueueSnackbar("Discount removed successfully", { variant: "success" });
      const { data: updatedOrder } = await refetch();
      setCart(updatedOrder?.data);
    } catch {
      enqueueSnackbar("Error removing discount", { variant: "error" });
    }
  };


  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420, md: 450 },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">
          <Text id="cart.your_cart" />
        </Typography>
        <IconButton onClick={onClose} aria-label="Close cart">
          <CloseIcon />
        </IconButton>
      </Box>

      <CartHeader cart={cart || null} handleDeleteDiscountFromOrder={handleDeleteDiscountFromOrder} />


      {/* Products Section */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 2,
        maxHeight: showDiscounts ? '35vh' : '55vh'
      }}>
        <CartContent
          cartItems={cartItems}
          hasValidInfo={hasValidInfo}
          isCartEmpty={isCartEmpty}
          removeItem={removeItem}
          toggleCart={handleCheckout}
          updateQuantity={updateQuantity}
          onClose={onClose}
        />
      </Box>
      
      <Divider />
      
      {/* Discount Toggle Section */}
      <Box sx={{ p: 1.5, backgroundColor: '#fff' }}>
        <Button
          fullWidth
          onClick={() => setShowDiscounts(!showDiscounts)}
          sx={{
            justifyContent: 'space-between',
            color: '#C8A846',
            border: '1px solid #C8A846',
            borderRadius: '6px',
            p: 1,
            fontSize: '0.875rem',
            '&:hover': {
              backgroundColor: 'rgba(200, 168, 70, 0.1)',
            }
          }}
          endIcon={showDiscounts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          <Typography variant="body2" fontWeight="medium">
            Thêm mã giảm giá
          </Typography>
        </Button>
      </Box>
      
      <Collapse in={showDiscounts}>
        <Box sx={{ 
          maxHeight: '30vh', 
          overflowY: 'auto',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}>
          <CartDiscount
            discounts={discounts}
            onApplyDiscount={handleApplyDiscount}
            onDeleteDiscountFromOrder={handleDeleteDiscountFromOrder}
            cartDiscounts={cart?.discounts}
          />
        </Box>
      </Collapse>

      <CartButton
        cartItems={cartItems}
        finalTotal={cart?.finalPrice || 0}
        onClose={onClose}
        subtotal={subtotal}
        toggleCart={handleCheckout}
      />
    </Drawer>
  );
};

export default Cart;


