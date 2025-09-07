import {
  DiscountCategoryInterface,
  DiscountInterface,
  DiscountValueType,
} from "@/shared/types/discount";
import { Gift, Tag, Package } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DiscountButton from "../../shared/components/DiscountButton";

// Styled Components
const StyledDiscountCard = styled(Card)(() => ({
  background: "#ffffff",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "#C8A846",
    boxShadow: "0 2px 8px rgba(200, 168, 70, 0.1)",
  },
}));

const StyledAccordion = styled(Accordion)(() => ({
  background: "transparent",
  boxShadow: "none",
  border: "none",
  "&:before": {
    display: "none",
  },
  "& .MuiAccordionSummary-root": {
    padding: "8px 12px",
    borderRadius: "6px",
    background: "#C8A846",
    color: "white",
    marginBottom: "6px",
    minHeight: "auto",
    "&:hover": {
      background: "#b8983e",
    },
  },
  "& .MuiAccordionDetails-root": {
    padding: "0 6px 12px 6px",
  },
}));

const VoucherInputContainer = styled(Box)(() => ({
  background: "#C8A846",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "12px",
}));

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
    <Box className="p-3">
      {/* Voucher Input Section */}
      <VoucherInputContainer>
        <Typography variant="body2" className="text-white mb-1.5 font-medium">
          Nhập mã voucher
        </Typography>
        <Box className="flex items-center gap-2">
          <TextField
            fullWidth
            size="small"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Nhập mã voucher"
            disabled={isApplyingVoucher}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: "6px",
                height: "36px",
                fontSize: "0.875rem",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
          <Button
            onClick={handleApplyVoucher}
            disabled={isApplyingVoucher || !voucherCode.trim()}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "white",
              color: "#C8A846",
              borderRadius: "6px",
              minWidth: "70px",
              height: "36px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
              "&:disabled": {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                color: "rgba(200, 168, 70, 0.5)",
              },
            }}
          >
            {isApplyingVoucher ? (
              <CircularProgress size={14} sx={{ color: "#C8A846" }} />
            ) : (
              "Áp dụng"
            )}
          </Button>
        </Box>
      </VoucherInputContainer>

      {/* Discount Categories */}
      <Box className="space-y-1.5">
        {discounts &&
          categories.map((category, index) => (
            <StyledAccordion key={category.id} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "white", fontSize: 20 }} />}>
                <Box className="flex items-center gap-2">
                  <Avatar
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      width: 24,
                      height: 24,
                    }}
                  >
                    <category.icon className="w-3 h-3 text-white" />
                  </Avatar>
                  <Typography variant="body2" className="font-medium">
                    {category.name}
                  </Typography>
                  <Chip
                    label={category.count}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: "bold",
                      height: "20px",
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="space-y-2">
                  {category.discount?.map((discount) => (
                    <StyledDiscountCard key={discount.id}>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box className="flex justify-between items-center gap-3">
                          <Box className="flex items-center gap-2 flex-1 min-w-0">
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: "rgba(200, 168, 70, 0.1)",
                                border: "1px solid #C8A846",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                className="text-[#C8A846] font-bold"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                {discount.valueType === DiscountValueType.PERCENTAGE
                                  ? `${discount.value}%`
                                  : `$${discount.value}`}
                              </Typography>
                            </Box>
                            <Box className="min-w-0 flex-1">
                              <Typography
                                variant="body2"
                                className="font-medium text-[#C8A846] truncate"
                                sx={{ fontSize: "0.8rem" }}
                              >
                                {discount.valueType === DiscountValueType.PERCENTAGE
                                  ? `${discount.value}% OFF`
                                  : `$${discount.value} OFF`}
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-gray-500 truncate block"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                Tối thiểu: ${discount.thresholdAmount} • Hết hạn: {new Date(discount.expireAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>

                          <DiscountButton
                            discountId={discount.id}
                            cartDiscounts={cartDiscounts || []}
                            onApplyDiscount={onApplyDiscount}
                            onDeleteDiscountFromOrder={onDeleteDiscountFromOrder}
                          />
                        </Box>
                      </CardContent>
                    </StyledDiscountCard>
                  ))}
                </Box>
              </AccordionDetails>
            </StyledAccordion>
          ))}
      </Box>
    </Box>
  );
}
