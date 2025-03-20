import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedCollection from "../product/FeaturedCollection";
import { useGetCategoriesDetailByCateName } from "../../hooks/queryClient/query/category";

const Navigation = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const { data: categories, isLoading } = useGetCategoriesDetailByCateName("Material");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const menuItems = [
    {
      title: "Men",
      navigate: "/products/men",
    },
    {
      title: "Women",
      navigate: "/products/women",
    },
    {
      title: "Collections",
      subMenu: <FeaturedCollection categories={categories} isLoading={isLoading} />,
    },
    {
      title: "Explore",
      navigate: "/explore",
    },
  ];

  const handleMenuHover = (title: string) => {
    setActiveMenu(title);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div className="flex justify-center w-80 ml-20 bg-white">
      <div className="container mx-auto px-4">
        <nav className={`${isOpen ? "block" : "hidden"} md:block py-6`}>
          <ul className="flex flex-col md:flex-row md:justify-center gap-8">
            {menuItems.map((item) => (
              <li
                key={item.title}
                className="relative group text-sm"
                onMouseEnter={() => handleMenuHover(item.title)}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  onClick={() => navigate(item.navigate ?? "")}
                  className="hover:text-gray-600 text-md font-medium uppercase tracking-wider"
                >
                  {item.title}
                </button>
                <div className="absolute h-0.5 bg-black w-0 group-hover:w-full transition-all duration-300 bottom-0"></div>

                {item.subMenu && (
                  <div
                    className={`${
                      activeMenu === item.title
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    } absolute top-full left-1/2 ml-[-60px] transform -translate-x-1/2 bg-white shadow-lg min-w-[120px] transition-all duration-300 z-50`}
                  >
                    {item.subMenu}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`block w-6 h-0.5 bg-black mb-1.5 transition-all ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-black mb-1.5 transition-all ${
            isOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-black transition-all ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>
    </div>
  );
};

export default Navigation;
