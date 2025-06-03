import React, { useState } from "react";
import { Search, Edit, Trash } from "lucide-react";
import { isLoginAdminAuth, AuthProps } from "../../components/wrapper/withAuth";
import { Order } from "../../types/order";
import { useGetOrderList } from "../../hooks/queryClient/query/order/use-get-list";
import IsLoadingWrapper from "../../components/wrapper/isLoading";
import { useDeleteOrder } from "../../hooks/queryClient/mutator/order/order";
import UpdateOrderStatus from "../../components/order/UpdateOrderStatus";

const OrdersManagement: React.FC<AuthProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentStatus, setCurrentStatus] = useState("Confirmed");

  const {
    data: orders,
    isLoading,
    refetch,
  } = useGetOrderList(currentStatus, 0, 10);
  const { mutateAsync: deleteOrder } = useDeleteOrder();
  const filteredOrders = orders?.filter((order: Order) =>
    order?.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <IsLoadingWrapper isLoading={isLoading}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Orders Management
          </h1>
          <p className="text-gray-600">
            Manage and track orders for your application
          </p>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
            />
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" />
              </th>

              {["Order ID", "Status", "Total", "Created At", "Actions"].map(
                (item, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders?.map((order: Order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <input type="checkbox" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.total_price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleOrderClick(order)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={16} className="mr-2" />
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        confirm("Are you sure you want to delete this order?")
                      ) {
                        await deleteOrder(order.id);
                        refetch();
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} className="mr-2" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#F5EFD9] px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex flex-col">
                    <span className="mb-2 font-medium">
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping Address</p>
                  <p className="font-medium">{selectedOrder.shippingAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ship Phone</p>
                  <p className="font-medium">{selectedOrder.shipPhone}</p>
                </div>
              </div>

              <div className="mt-6">
                {selectedOrder?.orderDetails?.length > 0 && (
                  <>
                    <h3 className="text-md font-medium text-gray-800 mb-2">
                      Products in Order
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {["Product Name", "Quantity", "Price", "Total"].map(
                              (item, index) => (
                                <th
                                  key={index}
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {item}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedOrder?.orderDetails?.map((detail, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {detail.product_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {detail.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${detail.price}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${detail.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              <UpdateOrderStatus
                selectedOrder={selectedOrder}
                refetch={refetch}
                currentStatus={currentStatus}
                setCurrentStatus={setCurrentStatus}
              />
              <div className="mt-6 bg-[#F5EFD9] p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Total Price</span>
                  <span className="font-medium">
                    ${Number(selectedOrder?.total_price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Shipping Fee</span>
                  <span className="font-medium">
                    ${Number(selectedOrder?.shippingFee || 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-[#E1D4A7] mt-2 pt-2 flex justify-between">
                  <span className="font-semibold text-gray-800">
                    Total Payment
                  </span>
                  <span className="font-bold text-lg text-[#C8A846]">
                    $
                    {Number(
                      Number(selectedOrder?.total_price) +
                        Number(selectedOrder?.shippingFee || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </IsLoadingWrapper>
  );
};

const WithOrdersManagement = isLoginAdminAuth(OrdersManagement);
export default WithOrdersManagement;
