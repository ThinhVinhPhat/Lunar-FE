import { Order } from "@/shared/types/order";
import { useCancelOrder } from "@/lib/hooks/queryClient/mutator/order/order";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import html2pdf from "html2pdf.js";

import PrintOrder from "@/shared/template/PrintOrder";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
function OrderModal({
  isOpen,
  onClose,
  currentOrder,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: Order | null;
  refetch: () => void;
}) {
  const { mutateAsync: cancelOrder } = useCancelOrder();
  const orderTemplate = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleCancelOrder = async () => {
    if (confirm("Are you want to reject this order?")) {
      const response = await cancelOrder(currentOrder?.id);
      if (response.status == 200) {
        refetch();
        onClose();
      }
    }
  };

  const handleCreatePDF = () => {
    const element = orderTemplate.current;
    if (!element) return;

    html2pdf()
      .set({
        margin: 0,
        filename: "order.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };
  return (
    isOpen && (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-[#F5EFD9] px-6 py-4 border-b border-gray-200 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={onClose}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{currentOrder?.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Placed</p>
                    <p className="font-medium">
                      {currentOrder?.createdAt
                        ? new Date(currentOrder?.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">
                      {currentOrder?.orderDetails.reduce(
                        (acc, item) => acc + Number(item.quantity),
                        0
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {currentOrder?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Shipping Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Delivery Address</p>
                      <p className="font-medium">
                        {currentOrder?.shippingAddress}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Contact Information
                      </p>
                      <p className="font-medium">
                        {currentOrder?.user?.firstName +
                          " " +
                          currentOrder?.user?.lastName}
                      </p>
                      <p className="font-medium">{currentOrder?.user?.email}</p>
                      <p className="font-medium">{currentOrder?.user?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Order Items
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder?.orderDetails.map((item) => (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md"></div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item?.product_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item?.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item?.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item?.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium">
                        Credit Card (ending in 4242)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Billing Address</p>
                      <p className="font-medium">Same as shipping address</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {currentOrder?.orderDetails.reduce(
                      (acc, item) => acc + Number(item.total),
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {currentOrder?.shippingFee}
                  </span>
                </div>

                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">
                    {currentOrder?.total_price}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                onClick={onClose}
              >
                Close
              </button>
              {currentOrder?.status !== "Rejected" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleCancelOrder();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/order/track/${currentOrder?.id}`);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  >
                    Track Order
                  </button>
                  <button
                    onClick={() => {
                      handleCreatePDF();
                    }}
                    className="px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#A88A3B] transition"
                  >
                    Download Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div ref={orderTemplate} id="order-template">
          <PrintOrder order={currentOrder} />
        </div>
      </>
    )
  );
}

export default OrderModal;
