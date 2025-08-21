import React, { useState, useMemo } from "react";
import {
  Gift,
  Calendar,
  Users,
  Package,
  Percent,
  Clock,
  Tag,
} from "lucide-react";
import {
  DiscountInterface,
  DiscountType,
  DiscountValueType,
} from "@/types/discount";
import { useGetDiscountsByUser } from "@/lib/hooks/queryClient/query/discount/discount.query";
import { formatDate } from "@/lib/ultis/formatDate";
import { useTranslation } from "react-i18next";
import { useApplyDiscountForUser } from "@/lib/hooks/queryClient/mutator/discount/discount.mutaition";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

const DiscountVoucherPage = () => {
  const PRIMARY_COLOR = "#C8A846";
  const PRIMARY_COLOR_HOVER = "#b39539";
  const PRIMARY_COLOR_LIGHT = "#d4b851";
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { data: discounts, total } = useGetDiscountsByUser();
  const { mutateAsync: applyDiscountForUser } = useApplyDiscountForUser();
  const categories = useMemo(() => {
    return [
      {
        id: "all",
        name: t("discount.all"),
        count: discounts?.all?.length || 0,
        icon: Gift,
      },
      {
        id: "discountProduct",
        name: t("discount.discountProduct"),
        count: discounts?.discountProduct?.length || 0,
        icon: Tag,
      },
      {
        id: "freeShip",
        name: t("discount.freeShip"),
        count: discounts?.freeShip?.length || 0,
        icon: Package,
      },
    ];
  }, [discounts]);

  const filteredAndSortedDiscounts = useMemo(() => {
    let discountsToFilter;
    if (selectedCategory === "all") {
      discountsToFilter = discounts?.all || [];
    } else if (selectedCategory === "discountProduct") {
      discountsToFilter = discounts?.discountProduct || [];
    } else if (selectedCategory === "freeShip") {
      discountsToFilter = discounts?.freeShip || [];
    }

    const filtered = discountsToFilter?.filter(
      (discount: DiscountInterface) => discount.isActive
    );

    return filtered?.sort((a: DiscountInterface, b: DiscountInterface) => {
      switch (sortBy) {
        case "value":
          return b.value - a.value;
        case "expiry":
          return (
            new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime()
          );
        case "usage":
          return b.userDiscounts?.length - a.userDiscounts?.length;
        default:
          return new Date(b.startAt).getTime() - new Date(a.startAt).getTime();
      }
    });
  }, [selectedCategory, sortBy, discounts]);

  const getDiscountLabel = (discount: DiscountInterface) => {
    if (discount.valueType === DiscountValueType.PERCENTAGE) {
      return `Giảm ${discount.value}%`;
    } else {
      return `Giảm ₫${discount.value.toLocaleString()}`;
    }
  };

  const getThresholdText = (amount: number) => {
    return `Đơn Tối Thiểu ₫${amount.toLocaleString()}`;
  };

  const getDiscountIcon = (type: DiscountType) => {
    switch (type) {
      case DiscountType.ALL_DISCOUNT:
        return <Gift className="w-6 h-6 text-white" />;
      case DiscountType.DISCOUNT:
        return <Tag className="w-6 h-6 text-white" />;
      case DiscountType.FREE_SHIP:
        return <Package className="w-6 h-6 text-white" />;
      default:
        return <Percent className="w-6 h-6 text-white" />;
    }
  };

  const isExpiringSoon = (expireDate: Date) => {
    const now = new Date();
    const expiry = new Date(expireDate);
    const hoursDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 72 && hoursDiff > 0;
  };

  const handleApplyDiscount = async (slug: string) => {
    try {
      await applyDiscountForUser(slug);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchDiscount = async () => {
    try {
      await applyDiscountForUser(searchTerm);
      setSearchTerm("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t("discount.discountVoucher")}
          </h1>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <button
                className="font-medium border-b-2 pb-1"
                style={{
                  color: PRIMARY_COLOR,
                  borderColor: PRIMARY_COLOR,
                }}
              >
                {t("discount.findMoreVoucher")}
              </button>
              <button
                className="text-gray-600 transition-colors hover:text-gray-800"
                style={{
                  color: PRIMARY_COLOR,
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = PRIMARY_COLOR)
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "#6B7280")
                }
              >
                {t("discount.viewHistoryVoucher")}
              </button>
              <button
                className="text-gray-600 transition-colors hover:text-gray-800"
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = PRIMARY_COLOR)
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "#6B7280")
                }
              >
                {t("discount.learnMore")}
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2"
                style={
                  { "--tw-ring-color": PRIMARY_COLOR } as React.CSSProperties
                }
                onFocus={(e) => (e.target.style.borderColor = PRIMARY_COLOR)}
                onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
              >
                <option value="newest">{t("discount.newest")}</option>
                <option value="value">{t("discount.highestValue")}</option>
                <option value="expiry">{t("discount.expiringSoon")}</option>
                <option value="usage">{t("discount.popular")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="flex items-center">
                <span className="bg-gray-100 px-3 py-2 text-sm text-gray-600 border border-r-0 rounded-l-lg">
                  {t("discount.voucherCode")}
                </span>
                <input
                  type="text"
                  placeholder={t("discount.enterVoucherCode")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-l-0 rounded-r-lg focus:outline-none focus:ring-2"
                  style={
                    { "--tw-ring-color": PRIMARY_COLOR } as React.CSSProperties
                  }
                  onFocus={(e) => (e.target.style.borderColor = PRIMARY_COLOR)}
                  onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
                />
              </div>
            </div>
            <button
              className="text-white px-6 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: PRIMARY_COLOR,
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.backgroundColor =
                  PRIMARY_COLOR_HOVER)
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.backgroundColor =
                  PRIMARY_COLOR)
              }
              onClick={handleSearchDiscount}
            >
              {t("discount.save")}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex overflow-x-auto">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedCategory === category.id
                    ? "border-b-2"
                    : "text-gray-600 border-transparent"
                }`}
                style={{
                  color:
                    selectedCategory === category.id
                      ? PRIMARY_COLOR
                      : "#6B7280",
                  borderColor:
                    selectedCategory === category.id
                      ? PRIMARY_COLOR
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    (e.target as HTMLElement).style.color = PRIMARY_COLOR;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    (e.target as HTMLElement).style.color = "#6B7280";
                  }
                }}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedDiscounts?.map((discount: DiscountInterface) => (
            <div
              key={discount.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div
                  className="w-24 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR_LIGHT} 100%)`,
                  }}
                >
                  {getDiscountIcon(discount.discountType)}
                  {isExpiringSoon(discount.expireAt) && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                      Hot
                    </div>
                  )}
                  <div className="absolute -right-3 top-0 w-6 h-6 bg-white rounded-full"></div>
                  <div className="absolute -right-3 bottom-0 w-6 h-6 bg-white rounded-full"></div>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3
                        className="font-bold text-lg"
                        style={{ color: PRIMARY_COLOR }}
                      >
                        {getDiscountLabel(discount)}
                      </h3>
                      <p className="text-sm text-gray-600">{discount.name}</p>
                    </div>
                    {isExpiringSoon(discount.expireAt) && (
                      <div className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {t("discount.expiringSoon")}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 mb-3">
                    {discount.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {getThresholdText(discount.thresholdAmount)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center mb-1">
                        <Users className="w-3 h-3 mr-1" />
                        Đã dùng: {discount.userDiscounts?.length}/
                        {discount.usageLimit}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Hết hạn: {formatDate(discount.expireAt.toString())}
                      </div>
                    </div>

                    <button
                      className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: PRIMARY_COLOR,
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor =
                          PRIMARY_COLOR_HOVER)
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.backgroundColor =
                          PRIMARY_COLOR)
                      }
                      onClick={() => handleApplyDiscount(discount.slug)}
                    >
                      {t("discount.useNow")}
                    </button>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          background: `linear-gradient(90deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR_LIGHT} 100%)`,
                          width: `${Math.min(
                            (discount.userDiscounts?.length /
                              discount.usageLimit) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      <CountdownTimer expireAt={discount?.expireAt} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedDiscounts?.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Không tìm thấy voucher phù hợp
            </h3>
            <p className="text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thêm voucher
            </p>
          </div>
        )}

        {filteredAndSortedDiscounts?.length < total && (
          <div className="text-center mt-8">
            <button
              className="bg-white border px-8 py-3 rounded-lg transition-colors font-medium"
              style={{
                borderColor: PRIMARY_COLOR,
                color: PRIMARY_COLOR,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = PRIMARY_COLOR;
                (e.target as HTMLElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "white";
                (e.target as HTMLElement).style.color = PRIMARY_COLOR;
              }}
            >
              Xem thêm voucher
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountVoucherPage;
