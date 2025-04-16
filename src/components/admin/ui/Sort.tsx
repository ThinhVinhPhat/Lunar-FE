import { Filter } from "lucide-react";

function Sort() {
  return (
    <div className="flex items-center gap-2">
      <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
        <Filter size={16} className="mr-2 text-gray-500" />
        Filters
      </button>
      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent">
        <option value="">All Categories</option>
        <option value="Sunglasses">Sunglasses</option>
        <option value="Eyeglasses">Eyeglasses</option>
        <option value="Readers">Readers</option>
        <option value="Sports">Sports</option>
      </select>
      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent">
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
    </div>
  );
}

export default Sort;
