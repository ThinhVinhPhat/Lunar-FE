import { Order } from "../../../types/order";
import Text from "../../../components/wrapper/Text";
import { useState } from "react";
import { Pagination } from "../../../components/ui/Pagination";
function OrderHistory({ orderList }: { orderList: any }) {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * 5;
  console.log(orderList);

  const orderListInPage = orderList?.orders?.slice(offset, offset + 5) || [];
  return (
    <div className="border-t border-gray-200 p-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#C8A846] mb-4">
          <Text id="order_history.order_history" />
        </h3>
        <div className="mb-4">
          <Pagination
            productCount={orderList?.orders?.length}
            currentPage={page}
            onSetPage={setPage}
          />
        </div>
      </div>
      {orderList && orderList.orders && orderList.orders.length > 0 ? (
        <div className="space-y-4">
          {orderListInPage.map((order: Order, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  <Text id="order_history.order" /> #{order.id}
                </span>
                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-md text-sm">
                  <Text id="order_history.confirmed" />
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <Text id="order_history.date" />:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <Text id="order_history.total" />: $
                  {(order.total_price || 0) + (order.shippingFee || 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">
            <Text id="order_history.you_dont_have_any_orders_yet" />
          </p>
          <button className="mt-4 px-6 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors">
            <Text id="order_history.shop_now" />
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
