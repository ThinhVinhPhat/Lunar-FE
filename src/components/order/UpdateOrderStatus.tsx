import { canTransition } from "@/database/admin/layout";
import { Order, OrderStatus, Shipment, TrackingOrder } from "@/types/order";
import { useEffect, useState } from "react";
import {
  useCreateOrderShipment,
  useUpdateOrderAddress,
  useUpdateOrderStatus,
} from "@/hooks/queryClient/mutator/order/order";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";

interface UpdateOrderStatusProps {
  selectedOrder: Order;
  refetch: () => void;
  currentStatus: string;
  setCurrentStatus: (status: string) => void;
}

export default function UpdateOrderStatus({
  selectedOrder,
  refetch,
  currentStatus,
  setCurrentStatus,
}: UpdateOrderStatusProps) {
  const [description, setDescription] = useState("");
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();
  const { mutateAsync: createOrderShipment } = useCreateOrderShipment();
  const { mutateAsync: updateOrderAddress } = useUpdateOrderAddress();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      estimateDate: "",
      deliveredDate: "",
      shippingCarrier: "",
    },
  });

  const {
    register: registerCurrentDelivery,
    handleSubmit: handleSubmitCurrentDelivery,
    reset: resetCurrentDelivery,
    formState: { isDirty: isDirtyCurrentDelivery },
  } = useForm({
    defaultValues: {
      currentDelivery: "",
    },
  });

  const latestShipment = selectedOrder?.shipments?.sort(
    (a: Shipment, b: Shipment) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const currentTrackingOrder = selectedOrder?.orderTracks?.sort(
    (a: TrackingOrder, b: TrackingOrder) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  useEffect(() => {
    reset({
      estimateDate: latestShipment?.estimatedDeliveryDate,
      deliveredDate: latestShipment?.deliveredAt,
      shippingCarrier: latestShipment?.shippingCarrier,
    });
  }, [latestShipment, reset]);

  useEffect(() => {
    resetCurrentDelivery({
      currentDelivery: currentTrackingOrder?.currentAddress,
    });
  }, [currentTrackingOrder, resetCurrentDelivery]);

  const handleUpdateOrderStatus = async (status: string) => {
    if (
      !canTransition(selectedOrder.status as OrderStatus, status as OrderStatus)
    ) {
      setIsOpenDescription(true);
      setCurrentStatus(status as OrderStatus);
    } else {
      await updateOrderStatus({
        orderId: selectedOrder.id,
        status: status as OrderStatus,
        description: description,
      });
      refetch();
      setIsOpenDescription(false);
    }
  };

  const handleCreateOrderShipment = async (data: any) => {
    if (errors.shippingCarrier || errors.estimateDate || errors.deliveredDate) {
      return;
    }

    if (
      data.currentDelivery &&
      data.currentDelivery !== currentTrackingOrder?.currentAddress
    ) {
      await updateOrderAddress({
        orderId: selectedOrder.id,
        address: data.currentDelivery,
      });
    }

    await createOrderShipment({
      orderId: selectedOrder.id,
      estimateDate: data.estimateDate,
      deliveredDate: data.deliveredDate,
      shippingCarrier: data.shippingCarrier,
    });
    refetch();
    setIsOpenDescription(false);
  };

  const handleUpdateOrderAddress = async (data: any) => {
    if (
      data.currentDelivery &&
      data.currentDelivery !== currentTrackingOrder?.currentAddress
    ) {
      await updateOrderAddress({
        orderId: selectedOrder.id,
        address: data.currentDelivery,
      });
    } else {
      enqueueSnackbar("Current delivery is required", {
        variant: "error",
      });
    }
    refetch();
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-[#E1D4A7]">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Update Order Status
      </h3>
      <div className="flex flex-wrap gap-3 mb-4">
        {["Pending", "Confirmed", "Shipped", "Delivered", "Rejected"].map(
          (status) =>
            status !== selectedOrder.status && (
              <button
                key={status}
                onClick={() => handleUpdateOrderStatus(status)}
                className={`text-sm py-2 px-4 rounded-md transition-all duration-200 font-medium ${
                  status === currentStatus
                    ? "bg-[#C8A846] text-white hover:bg-[#977f35]"
                    : status === "Rejected"
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : status === "Delivered"
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : "bg-[#F5EFD9] text-[#C8A846] hover:bg-[#E1D4A7]"
                }`}
              >
                {status}
              </button>
            )
        )}
      </div>
      {isOpenDescription && (
        <div className="bg-[#F9F7F1] p-4 rounded-lg border border-[#E1D4A7] mt-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Please provide a reason for this status change:
            </label>
            <textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent text-gray-700 transition-all duration-200"
            />
          </div>

          <div className="flex justify-end mt-3 gap-2">
            <button
              onClick={() => setIsOpenDescription(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (description === "") {
                  alert("Please provide a reason for this status change");
                  return;
                }
                setIsOpenDescription(false);
                await updateOrderStatus({
                  orderId: selectedOrder.id,
                  status: currentStatus,
                  description: description,
                });
                refetch();
                setIsOpenDescription(false);
              }}
              className="px-4 py-2 bg-[#C8A846] hover:bg-[#977f35] text-white rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {currentStatus == "Shipped" && (
        <div className="mt-6 border-t border-[#E1D4A7] pt-4">
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            Current Delivery
          </h4>
          <div>
            <form
              onSubmit={handleSubmitCurrentDelivery(handleUpdateOrderAddress)}
            >
              <input
                type="text"
                {...registerCurrentDelivery("currentDelivery", {
                  required: "Current delivery is required",
                })}
                defaultValue={currentTrackingOrder?.currentAddress || ""}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
              />
              <div className="flex justify-end mt-3 gap-2">
                <button
                  type="submit"
                  disabled={!isDirtyCurrentDelivery}
                  className="px-4 py-2 bg-[#C8A846] hover:bg-[#977f35] text-white rounded-md transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentStatus === "Shipped" && (
        <>
          <div className="mt-6 border-t border-[#E1D4A7] pt-4">
            <h4 className="text-lg font-medium text-gray-800 mb-4">
              Shipping Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Shipping Company
                </label>
                <select
                  {...register("shippingCarrier", {
                    required: "Shipping company is required",
                  })}
                  defaultValue={latestShipment?.shippingCarrier || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                >
                  <option value="">Select shipping company</option>
                  <option value="fedex">FedEx</option>
                  <option value="dhl">DHL</option>
                  <option value="ups">UPS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  {...register("estimateDate", {
                    required: "Estimated delivery date is required",
                  })}
                  defaultValue={
                    latestShipment?.estimatedDeliveryDate
                      ? new Date(latestShipment.estimatedDeliveryDate)
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Delivered Date
                </label>
                <input
                  type="date"
                  {...register("deliveredDate", {
                    required: "Delivered date is required",
                  })}
                  defaultValue={
                    latestShipment?.deliveredAt
                      ? new Date(latestShipment.deliveredAt)
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A846] focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-3 gap-2">
            <button
              disabled={!isDirty}
              onClick={handleSubmit(handleCreateOrderShipment)}
              className="px-4 py-2 bg-[#C8A846] hover:bg-[#977f35] text-white rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}
