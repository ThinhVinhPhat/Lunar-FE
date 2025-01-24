const Navigation = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) => {
  const menuItems = [
    {
      title: 'Men',
      submenu: ['Sunglasses', 'RX Eyewear']
    },
    {
      title: 'Women', 
      submenu: ['Sunglasses', 'RX Eyewear']
    },
    {
      title: 'Collections',
      submenu: ['CAMP', 'ACTV Performance', 'Acetate', 'Wood', 'Metal']
    },
    {
      title: 'Explore',
      submenu: ['Our Story', 'Our Process', 'Time Well Spent']
    }
  ];

  return (
    <nav className={`${isOpen ? 'block' : 'hidden'} md:block`}>
      <ul className="flex flex-col md:flex-row gap-6">
        {menuItems.map((item) => (
          <li key={item.title} className="relative group">
            <button className="hover:text-gray-600">{item.title}</button>
            <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-lg p-4 min-w-[200px]">
              <ul className="space-y-2">
                {item.submenu.map((subItem) => (
                  <li key={subItem}>
                    <a href="#" className="hover:text-gray-600">{subItem}</a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 