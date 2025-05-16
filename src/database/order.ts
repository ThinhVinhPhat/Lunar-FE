import { OrderStatus } from "../types/order";

export const canTransition = (from: OrderStatus, to: OrderStatus) => {
  if (from === OrderStatus.PENDING) return to === OrderStatus.PENDING;
  if (from === OrderStatus.CONFIRMED)
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(to);
  if (from === OrderStatus.SHIPPED)
    return [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
    ].includes(to);
  if (from === OrderStatus.DELIVERED)
    return [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ].includes(to);
  return false;
};
