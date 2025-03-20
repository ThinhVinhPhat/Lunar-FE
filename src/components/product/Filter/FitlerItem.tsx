import { FiChevronDown, FiChevronUp } from "react-icons/fi";

type FilterItemProps = {
  name: string;
  activeFilters: any;
  handleFilterChange: any;
  toggleSection: any;
  openSections: any;
  filterOptions: any;
};
function FilterItem({
  name,
  activeFilters,
  handleFilterChange,
  toggleSection,
  openSections,
  filterOptions,
}: FilterItemProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium"
        onClick={() => toggleSection(name)}
      >
        {name.charAt(0).toUpperCase() + name.slice(1)}
        {openSections[name] ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {openSections[name] && (
        <div className="mt-2 space-y-2">
          {filterOptions[name].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={activeFilters.categories.includes(category)}
                onChange={() => handleFilterChange("categories", category)}
                className="h-4 w-4 text-[#C8A846] focus:ring-[#C8A846]"
              />
              <span className="ml-2">{category}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterItem;
