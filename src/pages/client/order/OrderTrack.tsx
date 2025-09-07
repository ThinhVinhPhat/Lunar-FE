import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetOrderById } from "@/lib/hooks/queryClient/query/order/order.query";
import { useNavigate, useParams } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { AuthProps, isLoginAuth } from "@/shared/components/wrapper/withAuth";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { useTranslation } from "react-i18next";
import {
  OrderDetail,
  OrderHistory,
  OrderStatus,
  Shipment,
  TrackingOrder,
} from "@/shared/types/order";
import clsx from "clsx";
import { canTransition } from "@/database/order";
import { UseMapRender } from "@/shared/hooks/useMapRender";
const OrderTrack: React.FC<AuthProps> = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderById(id);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const latestShipment = order?.shipments?.sort(
    (a: Shipment, b: Shipment) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const latestTrackingOrder = order?.orderTracks?.sort(
    (a: TrackingOrder, b: TrackingOrder) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
    ? order?.orderTracks?.sort(
        (a: TrackingOrder, b: TrackingOrder) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : import.meta.env.VITE_SHIPPING_ADDRESS;

  return (
    <IsLoadingWrapper isLoading={isLoading}>
      <div className="container mx-auto px-4 py-8 mt-36">
        <div className="flex mb-6 justify-between items-center">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              onClick={() => navigate(-1)}
              icon={faArrowLeft}
              className="text-[#C8A846]"
            />
            <span className="text-gray-700 hover:text-[#C8A846] transition-colors">
              {t("order_track.back_to_order_list")}
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {t("order_track.track_your_order")}
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 border border-[#F5EFD9]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">
                {t("order_track.order_code")}:
              </p>
              <p className="font-medium text-[#C8A846]">{order?.id}</p>
            </div>
            <div>
              <span
                className={clsx(
                  "px-3 py-1 inline-flex text-sm font-semibold rounded-full",
                  {
                    "bg-red-500 text-white":
                      order?.status === OrderStatus.REJECTED,
                    "bg-[#C8A846] text-white":
                      order?.status === OrderStatus.DELIVERED,
                    "bg-[#E1D4A7] text-gray-800":
                      order?.status === OrderStatus.SHIPPED,
                    "bg-[#F5EFD9] text-gray-800":
                      order?.status === OrderStatus.CONFIRMED,
                    "bg-gray-200 text-gray-800":
                      order?.status === OrderStatus.PENDING,
                  }
                )}
              >
                {t(`order_track.${order?.status}`)}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between mb-2">
              {/* Step indicators */}
              {[
                OrderStatus.PENDING,
                OrderStatus.CONFIRMED,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.REJECTED,
              ].map((step, index) => {
                const isActive = order?.status === step;
                const isRejected = order?.status === OrderStatus.REJECTED;
                const isPassed = (() => {
                  if (isRejected) return false;
                  if (canTransition(order?.status, step)) return true;
                  return false;
                })();
                const label = t(`order_track.${step}`);
                return (
                  <div key={index} className="flex flex-col items-center z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isRejected && step === OrderStatus.REJECTED
                          ? "bg-red-500 border-red-500 text-white"
                          : isPassed || isActive
                          ? "bg-[#C8A846] border-[#C8A846] text-white"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs mt-2 text-center font-medium">
                      {label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {
                        order?.histories?.find(
                          (history: OrderHistory) => history.action === "UPDATE_STATUS"
                        )?.createdAt
                      }
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
              <div
                className={`h-full ${
                  order?.status === OrderStatus.REJECTED
                    ? "bg-red-500"
                    : "bg-[#C8A846]"
                }`}
                style={{
                  width: `${
                    order?.status === OrderStatus.PENDING
                      ? "5%"
                      : order?.status === OrderStatus.CONFIRMED
                      ? "27%"
                      : order?.status === OrderStatus.SHIPPED
                      ? "50%"
                      : order?.status === OrderStatus.DELIVERED
                      ? "74%"
                      : order?.status === OrderStatus.REJECTED
                      ? "100%"
                      : "0%"
                  }`,
                }}
              ></div>
            </div>
          </div>

          {/* Tracking Map */}
          {order?.status === OrderStatus.SHIPPED && (
            <div className="mt-8 border-t border-[#F5EFD9] pt-6">
              <h3 className="text-lg font-semibold mb-4 text-[#C8A846]">
                {t("order_track.live_tracking")}
              </h3>
              <div className="bg-[#F5EFD9] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#C8A846] flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">
                        {t("order_track.estimated_delivery")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {latestShipment?.estimatedDeliveryDate.split("T")[1] +
                          " giờ " +
                          " ngày " +
                          latestShipment?.estimatedDeliveryDate.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-[#C8A846] border border-[#C8A846]">
                    {t("order_track.on_the_way")}
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-md border border-[#E1D4A7] h-80 bg-white">
                  {order?.status === OrderStatus.SHIPPED ? (
                    <UseMapRender
                      origin={latestTrackingOrder?.currentAddress}
                      destination={order?.shippingAddress}
                    />
                  ) : order?.status === OrderStatus.DELIVERED ? (
                    <UseMapRender
                      origin={order?.shippingAddress}
                      destination={order?.shippingAddress}
                    />
                  ) : null}
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C8A846] mr-2"></div>
                    <span className="text-gray-700">
                      {t("order_track.current_location")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-gray-700">
                      {t("order_track.destination")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-[#F5EFD9] pt-6">
            <h3 className="text-lg font-semibold mb-4 text-[#C8A846]">
              {t("order_track.order_detail")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  {t("order_track.shipping_address")}:
                </p>
                <p className="font-medium">{order?.shippingAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {t("order_track.payment_method")}:
                </p>
                <p className="font-medium">
                  {t(`order_track.${order?.payment?.method}`)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-[#C8A846]">
              {t("order_track.product")}
            </h3>
            <div className="border border-[#F5EFD9] rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#C8A846] text-white">
                  {[
                    t("order_track.product"),
                    t("order_track.quantity"),
                    t("order_track.price"),
                  ].map((item, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {item}
                    </th>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order?.orderDetails.map(
                    (item: OrderDetail, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-[#F5EFD9] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-12 flex-shrink-0 bg-[#F5EFD9] rounded-md">
                              <img
                                src={item.product?.images[0]}
                                alt={item.product?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.product?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#C8A846]">
                          {Number(item.product?.price).toLocaleString()} $
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-[#F5EFD9] p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                {t("order_track.total_price")}
              </span>
              <span className="font-medium">
                {Number(order?.total_price).toLocaleString()} $
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                {t("order_track.shipping_fee")}
              </span>
              <span className="font-medium">
                {Number(order?.shippingFee).toLocaleString()} $
              </span>
            </div>
            <div className="border-t border-[#E1D4A7] mt-2 pt-2 flex justify-between">
              <span className="font-semibold text-gray-800">
                {t("order_track.total_payment")}
              </span>
              <span className="font-bold text-lg text-[#C8A846]">
                {Number(
                  Number(order?.total_price) + Number(order?.shippingFee)
                ).toLocaleString()}{" "}
                $
              </span>
            </div>
          </div>

          {/* Order History Section */}
          <div className="mt-8 border-t border-[#F5EFD9] pt-6">
            <h3 className="text-lg font-semibold mb-4 text-[#C8A846]">
              {t("order_track.order_history")}
            </h3>
            <div className="bg-white rounded-lg border border-[#F5EFD9] overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5EFD9]">
                  <tr>
                    {[
                      t("order_track.date"),
                      t("order_track.action"),
                      t("order_track.description"),
                    ].map((item, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order?.histories?.map(
                    (
                      history: {
                        action: string;
                        createdAt: string;
                        description?: string;
                      },
                      index: number
                    ) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(history.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                              history.action === "UPDATE_STATUS"
                                ? "bg-blue-100 text-blue-800"
                                : history.action === "ADD_PRODUCT"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {history.action === "UPDATE_STATUS"
                              ? t("order_track.status_updated")
                              : history.action === "ADD_PRODUCT"
                              ? t("order_track.product_added")
                              : history.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {history.description || "-"}
                        </td>
                      </tr>
                    )
                  )}
                  {(!order?.histories || order.histories.length === 0) && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        {t("order_track.no_history_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </IsLoadingWrapper>
  );
};

const OrderTrackWrapper = isLoginAuth(OrderTrack);

export default OrderTrackWrapper;
