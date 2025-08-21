import {
  DiscountCategoryInterface,
  DiscountInterface,
  DiscountValueType,
} from "@/types/discount";
import { Gift, Tag, Package, Loader2 as Spinner } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DiscountButton from "../ui/DiscountButton";

type DiscountProps = {
  discounts: DiscountCategoryInterface | undefined;
  onApplyDiscount: (discountId: string) => void;
  onDeleteDiscountFromOrder: (discountId: string) => void;
  cartDiscounts: DiscountInterface[] | undefined;
};

export default function CartDiscount({
  discounts,
  onApplyDiscount,
  onDeleteDiscountFromOrder,
  cartDiscounts,
}: DiscountProps) {
  const { t } = useTranslation();
  const [voucherCode, setVoucherCode] = useState("");
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const categories = useMemo(() => {
    return [
      {
        id: "all",
        name: t("discount.all"),
        discount: discounts?.all,
        count: discounts?.all?.length || 0,
        icon: Gift,
      },
      {
        id: "allProducts",
        name: t("discount.allProducts"),
        discount: discounts?.allProducts,
        count: discounts?.allProducts?.length || 0,
        icon: Gift,
      },
      {
        id: "discountProduct",
        name: t("discount.discountProduct"),
        discount: discounts?.discountProduct,
        count: discounts?.discountProduct?.length || 0,
        icon: Tag,
      },
      {
        id: "freeShip",
        name: t("discount.freeShip"),
        discount: discounts?.freeShip,
        count: discounts?.freeShip?.length || 0,
        icon: Package,
      },
    ];
  }, [discounts, t]);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;

    setIsApplyingVoucher(true);
    try {
      await onApplyDiscount(voucherCode);
      setVoucherCode("");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  return (
    <div className="border-t border-gray-200 p-2 max-h-[400px] overflow-y-auto">
      <div className="flex items-center gap-2 w-[420px] p-4 mb-4 sticky top-0 bg-gray-100 rounded-md z-10 pb-4">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder={t("discount.enter_voucher_code")}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C8A846]"
          disabled={isApplyingVoucher}
        />
        <button
          onClick={handleApplyVoucher}
          disabled={isApplyingVoucher || !voucherCode.trim()}
          className="px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#ae923e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
        >
          {isApplyingVoucher ? (
            <Spinner className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            t("discount.apply")
          )}
        </button>
      </div>

      <div className="space-y-4">
        {discounts &&
          categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <category.icon className="w-5 h-5 text-[#C8A846]" />
                <h3 className="font-medium">{category.name}</h3>
                <span className="text-sm text-gray-500">
                  ({category.count})
                </span>
              </div>

              {category.discount?.map((discount) => (
                <div
                  key={discount.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-14 w-14 bg-[#C8A846]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C8A846] font-semibold">
                          {discount.valueType === DiscountValueType.PERCENTAGE
                            ? `${discount.value}%`
                            : `$${discount.value}`}
                        </span>
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-medium text-[#C8A846] truncate">
                          {discount.valueType === DiscountValueType.PERCENTAGE
                            ? `${discount.value}% OFF`
                            : `$${discount.value} OFF`}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {t("discount.min_spend")}: ${discount.thresholdAmount}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {t("discount.expires")}:{" "}
                          {new Date(discount.expireAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <DiscountButton
                      discountId={discount.id}
                      cartDiscounts={cartDiscounts || []}
                      onApplyDiscount={onApplyDiscount}
                      onDeleteDiscountFromOrder={onDeleteDiscountFromOrder}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
