function UserProduct() {
  return (
    <div className="border-t border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#C8A846] mb-4">
            Favorite Products
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              You don't have any favorite products yet.
            </p>
            <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
              Explore Products
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#C8A846] mb-4">
            Your Reviews
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              You haven't reviewed any products yet.
            </p>
            <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
              View Purchased Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProduct;
