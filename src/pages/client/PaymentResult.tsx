import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getFailedPayment,
  getSuccessPayment,
} from "../../api/service/payment.service";

type PaymentResultProps = {
  status: "success" | "failed";
};
const PaymentResult: React.FC<PaymentResultProps> = ({ status }) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<"success" | "failed">(
    "success"
  );
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  useEffect(() => {
    if (status === "failed") {
      setCurrentStatus("failed");
    } else {
      setCurrentStatus("success");
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentStatus == "success") {
        await getSuccessPayment(orderId, sessionId);
      } else {
        await getFailedPayment();
      }
    };
    fetchData();
  }, [currentStatus, orderId, sessionId]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full text-center">
        {status === "success" ? (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold mt-3 text-green-600">
              Thanh toán thành công!
            </h2>
            <p className="mt-2 text-gray-600">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold mt-3 text-red-600">
              Thanh toán thất bại
            </h2>
            <p className="mt-2 text-gray-600">
              Rất tiếc, giao dịch của bạn không thể hoàn tất.
            </p>
          </>
        )}

        <button
          onClick={handleBackToHome}
          className="mt-4 bg-[#C8A846] text-white py-2 px-4 rounded-md hover:bg-[#897334] transition-colors w-full"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;
