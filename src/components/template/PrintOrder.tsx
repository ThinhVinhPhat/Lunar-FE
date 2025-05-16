import { Order } from "@/types/order";

export default function PrintOrder({ order }: { order: Order | null }) {
  console.log(order);
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Receipt</h1>
          <p className="text-gray-600">Order #{order?.id}</p>
          <p className="text-gray-600">
            {new Date(order?.createdAt || "").toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-[#C8A846]">Eyewear Shop</h2>
          <p className="text-gray-600">123 Fashion Street</p>
          <p className="text-gray-600">contact@eyewearshop.com</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Customer Information
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {order?.user?.firstName + " " + order?.user?.lastName}
          </p>
          <p>
            <span className="font-medium">Email:</span> {order?.user?.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            {order?.user?.phone || "N/A"}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {order?.shippingAddress}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Order Details
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2 border">Product</th>
              <th className="text-left p-2 border">Quantity</th>
              <th className="text-right p-2 border">Price</th>
              <th className="text-right p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {order?.orderDetails?.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 border">{item.product_name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border text-right">${item.price}</td>
                <td className="p-2 border text-right">
                  ${item.quantity * Number(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={3} className="p-2 border text-right font-medium">
                Subtotal:
              </td>
              <td className="p-2 border text-right">${order?.total_price}</td>
            </tr>
            <tr className="bg-gray-50">
              <td colSpan={3} className="p-2 border text-right font-medium">
                Shipping:
              </td>
              <td className="p-2 border text-right">
                ${order?.shippingFee || 0}
              </td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td colSpan={3} className="p-2 border text-right">
                Total:
              </td>
              <td className="p-2 border text-right">
                ${(order?.total_price || 0) + (order?.shippingFee || 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Payment Information
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>
            <span className="font-medium">Payment Method:</span>{" "}
            {order?.paymentId}
          </p>
          <p>
            <span className="font-medium">Payment Status:</span> {order?.status}
          </p>
        </div>
      </div>

      <div className="text-center mt-12 mb-8">
        <button
          onClick={() => window.print()}
          className="bg-[#C8A846] text-white px-6 py-2 rounded-lg print:hidden hover:bg-[#b39a3f] transition-colors"
        >
          Print Receipt
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm mt-8 border-t pt-4">
        <p>Thank you for your purchase!</p>
        <p>If you have any questions, please contact our customer service.</p>
      </div>
    </div>
  );
}
