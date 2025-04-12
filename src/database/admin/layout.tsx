import { Settings, ShieldCheck, Users } from "lucide-react";
import { LayoutDashboard, Package, Tags } from "lucide-react";
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
    title: "Permissions",
    path: "/admin/permissions",
    icon: <ShieldCheck size={20} />,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: <Settings size={20} />,
  },
];
