import { Pagination } from "../../../components/ui/Pagination";
import clsx from "clsx";
import { useState } from "react";
import OrderModal from "./OrderModal";
import { useGetOrderList } from "../../../hooks/queryClient/query/order/use-get-list";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { Order } from "@/types/order";
import { AuthProps, isLoginAuth } from "../../../components/wrapper/withAuth";
import OrderEmpty from "./OrderEmpty";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderList: React.FC<AuthProps> = () => {
  const [status, setStatus] = useState("ALL_ORDER");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const offset = (page - 1) * 10;
  const navigate = useNavigate();
  const {
    data: orderList,
    isLoading: isOrderListLoading,
    refetch,
    total,
  } = useGetOrderList(status, offset, 10);
  const { t } = useTranslation();

  console.log(orderList);
  // Define column headers with their data keys and translation labels
  const columnHeaders = [
    { key: "id", label: t("order_list.order_id", "Order ID") },
    { key: "date", label: t("order_list.date", "Date") },
    { key: "total", label: t("order_list.total", "Total") },
    { key: "status", label: t("order_list.status", "Status") },
    { key: "actions", label: t("order_list.actions", "Actions") },
  ];

  const statusOptions = [
    { value: "ALL_ORDER", label: t("order_list.all_orders", "ALL_ORDER") },
    { value: "Pending", label: t("order_list.pending", "Pending") },
    { value: "Confirmed", label: t("order_list.confirmed", "Confirmed") },
    { value: "Shipped", label: t("order_list.shipped", "Shipped") },
    { value: "Delivered", label: t("order_list.delivered", "Delivered") },
    { value: "Rejected", label: t("order_list.rejected", "Rejected") },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-36">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {t("order_list.your_orders")}
      </h1>

      <div className="mb-6 flex space-x-4">
        {statusOptions.map((item) => (
          <button
            key={item.value}
            className={clsx(
              "px-4 py-2  text-white font-bold rounded-md hover:bg-[#A88A3B] transition",
              {
                "bg-[#C8A846]": item.value === status,
                "bg-[#e1ddce] ": item.value !== status,
              }
            )}
            onClick={() => setStatus(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isOpen && (
        <OrderModal
          refetch={refetch}
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
                  {columnHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderList?.length === 0 ? (
                  <OrderEmpty />
                ) : (
                  orderList?.map((order: Order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.total_price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={clsx(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            {
                              "bg-green-100 text-green-800":
                                order.status == "Confirmed",
                              "bg-blue-100 text-blue-800":
                                order.status == "Pending",
                              "bg-red-100 text-red-800":
                                order.status == "Rejected",
                              "bg-yellow-100 text-yellow-800":
                                order.status == "Shipped",
                              "bg-gray-100 text-gray-800":
                                order.status == "Delivered",
                            }
                          )}
                        >
                          {t(
                            `order_list.status_${order.status.toLowerCase()}`,
                            order.status
                          )}
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
                          {t("order_list.view_details", "View Details")}
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/order/track/${order.id}`);
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {t("order_list.track", "Track")}
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
      {orderList?.length > 10 && (
        <Pagination
          productCount={total}
          currentPage={page}
          onSetPage={setPage}
        />
      )}
    </div>
  );
};

const WOrderList = isLoginAuth(OrderList);

export default WOrderList;
