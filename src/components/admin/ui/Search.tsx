import { Search } from "lucide-react";
type SearchProps = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  placeholder: string;
};

function SearchComponent({ searchTerm, setSearchTerm, placeholder }: SearchProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
      />
    </div>
  );
}

export default SearchComponent;
