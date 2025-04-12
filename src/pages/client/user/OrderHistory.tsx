import { Order } from "../../../types/order";

function OrderHistory({ orderList }: { orderList: any }) {
  return (
    <div className="border-t border-gray-200 p-6">
      <h3 className="text-xl font-bold text-[#C8A846] mb-4">Order History</h3>
      {orderList && orderList.orders && orderList.orders.length > 0 ? (
        <div className="space-y-4">
          {orderList.orders.map((order: Order, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order #{order.id}</span>
                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md text-sm">
                  Confirmed
                </span>
                
              </div>
              <div className="text-sm text-gray-600">
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total: ${order.total}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">You don't have any orders yet.</p>
          <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
            Shop Now
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
