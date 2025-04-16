import { Pagination } from "../../../components/ui/Pagination";
import clsx from "clsx";
import { useState } from "react";
import OrderModal from "./OrderModal";
import { useGetOrderList } from "../../../hooks/queryClient/query/order/use-get-list";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { Order } from "@/types/order";
import { AuthProps, isLoginAuth } from "../../../components/withAuth";
import OrderEmpty from "./OrderEmpty";

const OrderList: React.FC<AuthProps> = () => {
  const [status, setStatus] = useState("ALL_ORDER");
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const offset = (page - 1) * 10;
  const { data: orderList, isLoading: isOrderListLoading } = useGetOrderList(
    status,
    offset,
    10
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-36">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      <div className="mb-6 flex space-x-4">
        {[
          "ALL_ORDER",
          "Pending",
          "Confirmed",
          "Shipped",
          "Delivered",
          "Rejected",
        ].map((item) => (
          <button
            className={clsx(
              "px-4 py-2  text-white font-bold rounded-md hover:bg-[#A88A3B] transition",
              {
                "bg-[#C8A846]": item === status,
                "bg-[#e1ddce] ": item !== status,
              }
            )}
            onClick={() => setStatus(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {isOpen && (
        <OrderModal
          currentOrder={currentOrder}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      {isOrderListLoading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F5EFD9]">
                <tr>
                  {["Order ID", "Date", "Total", "Status", "Actions"].map(
                    (item) => (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {item}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderList?.orders?.length === 0 ? (
                  <OrderEmpty />
                ) : (
                  orderList?.orders?.map((order: Order) => (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setCurrentOrder(order);
                            setIsOpen(true);
                          }}
                          className="text-[#C8A846] hover:text-[#A88A3B] mr-3"
                        >
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Track
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {orderList?.orders?.length > 10 && (
        <Pagination
          productCount={orderList?.total}
          currentPage={page}
          onSetPage={setPage}
        />
      )}
    </div>
  );
};

const WOrderList = isLoginAuth(OrderList);

export default WOrderList;
