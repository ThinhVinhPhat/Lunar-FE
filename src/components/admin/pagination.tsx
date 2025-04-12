import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  filteredProducts: Product[];
  products: Product[];
  setPage: (page: number) => void;
  page: number;
  totalPages: number;
}

function Pagination({
  filteredProducts,
  products,
  setPage,
  page,
  totalPages,
}: PaginationProps) {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredProducts?.length}</span> of{" "}
            <span className="font-medium">{products?.length}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setPage(page - 1)}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-[#C8A846]"
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
