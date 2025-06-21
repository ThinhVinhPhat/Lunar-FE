import { useState } from "react";
import NotificationBell from "../ui/NotiDropDown";

type Props = {
  isSidebarOpen: boolean;
};

export default function Header({ isSidebarOpen }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header
      className="bg-white shadow-sm h-16 fixed right-0 left-0 z-10"
      style={{
        left: isSidebarOpen
          ? window.innerWidth >= 768
            ? "16rem"
            : "0"
          : window.innerWidth >= 768
          ? "5rem"
          : "0",
      }}
    >
      <div
        className={`flex items-center justify-between  w-[${
          isSidebarOpen ? "83%" : "95%"
        }] h-full px-3 md:px-18`}
      >
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
          Admin Dashboard
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          <NotificationBell isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </header>
  );
}
