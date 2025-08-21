import { Role } from "@/types/notification";
import { OrderStatus } from "@/types/order";
import {
  Settings,
  Users,
  LayoutDashboard,
  Package,
  Tags,
  PackageSearch,
  Bell,
  PercentCircle,
} from "lucide-react";
export const navItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
    roles: [Role.ADMIN],
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: <Package size={20} />,
    roles: [Role.ADMIN, Role.ENGINEER],
  },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: <Tags size={20} />,
    roles: [Role.ADMIN, Role.ENGINEER],
  },
  {
    title: "Accounts",
    path: "/admin/accounts",
    icon: <Users size={20} />,
    roles: [Role.ADMIN],
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <PackageSearch size={20} />,
    roles: [Role.ADMIN, Role.ENGINEER],
  },
  {
    title: "Notifications",
    path: "/admin/notifications",
    icon: <Bell size={20} />,
    roles: [Role.ADMIN],
  },
  {
    title: "Discounts",
    path: "/admin/discounts",
    icon: <PercentCircle size={20} />,
    roles: [Role.ADMIN],
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <Settings size={20} />,
    roles: [Role.ADMIN],
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
