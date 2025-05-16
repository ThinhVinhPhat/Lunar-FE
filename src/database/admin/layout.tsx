import { OrderStatus } from "../../types/order";
import {
  Settings,
  Users,
  LayoutDashboard,
  Package,
  Tags,
  PackageSearch,
} from "lucide-react";
export const navItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { title: "Products", path: "/admin/products", icon: <Package size={20} /> },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: <Tags size={20} />,
  },
  { title: "Accounts", path: "/admin/accounts", icon: <Users size={20} /> },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <PackageSearch size={20} />,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <Settings size={20} />,
  },
];

export const canTransition = (
  from: OrderStatus | undefined,
  to: OrderStatus
): boolean => {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.ALL_ORDER]: [],
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.REJECTED],
    [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.REJECTED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.REJECTED]: [],
  };

  return validTransitions[
    (from as OrderStatus) || OrderStatus.PENDING
  ].includes(to);
};
