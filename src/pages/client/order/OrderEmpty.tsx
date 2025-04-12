function OrderEmpty() {
  return (
    <div className="hidden mt-8 text-center py-12 bg-gray-50 rounded-lg">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No orders found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        You haven't placed any orders yet.
      </p>
      <div className="mt-6">
        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#C8A846] hover:bg-[#A88A3B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846]">
          Start Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderEmpty;
