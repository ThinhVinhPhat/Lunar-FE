import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DiscountInterface } from "@/types/discount";
import LoadingSpinner from "./LoadingSpinner";

type DiscountButtonProps = {
  discountId: string;
  cartDiscounts: DiscountInterface[];
  onApplyDiscount: (discountId: string) => void;
  onDeleteDiscountFromOrder: (discountId: string) => void;
};

export default function DiscountButton({
  discountId,
  cartDiscounts,
  onApplyDiscount,
  onDeleteDiscountFromOrder,
}: DiscountButtonProps) {
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();
  const isApplied = cartDiscounts?.some((d) => d.id === discountId);

  const handleClick = async () => {
    setPending(true);
    try {
      if (isApplied) {
        await onDeleteDiscountFromOrder(discountId);
      } else {
        await onApplyDiscount(discountId);
      }
    } catch (error) {
      console.error("Failed to handle discount:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`
        px-4 py-2 rounded-md text-sm font-medium min-w-[100px]
        ${
          isApplied
            ? "bg-red-500 hover:bg-red-600"
            : "bg-[#C8A846] hover:bg-[#ae923e]"
        }
        text-white transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {pending ? (
        <LoadingSpinner />
      ) : isApplied ? (
        t("discount.delete")
      ) : (
        t("discount.use_now")
      )}
    </button>
  );
}
