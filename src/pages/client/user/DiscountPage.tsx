import { useState, useMemo } from "react";
import {
  DiscountInterface,
  DiscountType,
  DiscountValueType,
} from "@/shared/types/discount";
import { useGetDiscountsByUser } from "@/lib/hooks/queryClient/query/discount/discount.query";
import { formatDate } from "@/lib/ultis/formatDate";
import { useTranslation } from "react-i18next";
import { useApplyDiscountForUser } from "@/lib/hooks/queryClient/mutator/discount/discount.mutaition";
import { CountdownTimer } from "@/shared/components/CountdownTimer";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  IconButton,
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {
  LocalOffer,
  CalendarToday,
  People,
  LocalShipping,
  Percent,
  AccessTime,
  Search,
  ContentCopy,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

enum SortBy {
  NEWEST = "newest",
  OLDEST = "oldest",
  VALUE = "value",
  EXPIRY = "expiry",
  USAGE = "usage",
}

const DiscountVoucherPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState(SortBy.NEWEST);
  const { data: discounts, total } = useGetDiscountsByUser();
  const { mutateAsync: applyDiscountForUser } = useApplyDiscountForUser();
  const categories = useMemo(() => {
    return [
      {
        id: "all",
        name: t("discount.all"),
        count: discounts?.all?.length || 0,
        icon: LocalOffer,
      },
      {
        id: "discountProduct",
        name: t("discount.discountProduct"),
        count: discounts?.discountProduct?.length || 0,
        icon: Percent,
      },
      {
        id: "freeShip",
        name: t("discount.freeShip"),
        count: discounts?.freeShip?.length || 0,
        icon: LocalShipping,
      },
    ];
  }, [discounts, t]);

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
        case SortBy.VALUE:
          return b.value - a.value;
        case SortBy.EXPIRY:
          return (
            new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime()
          );
        case SortBy.USAGE:
          return (b.userDiscounts?.length || 0) - (a.userDiscounts?.length || 0);
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
        return <LocalOffer className="text-white" />;
      case DiscountType.DISCOUNT:
        return <Percent className="text-white" />;
      case DiscountType.FREE_SHIP:
        return <LocalShipping className="text-white" />;
      default:
        return <LocalOffer className="text-white" />;
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    enqueueSnackbar("Copied to clipboard", { variant: "success" });
  };

  const isExpiringSoon = (expireDate: Date) => {
    const now = new Date();
    const expiry = new Date(expireDate);
    const hoursDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 72 && hoursDiff > 0;
  };

  const handleApplyDiscount = async () => {
    navigate(`/products/:type`);
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
    <Box>
      <Card elevation={2} className="mb-6">
        <CardContent>
          <Box display="flex" alignItems="center" gap="16px" mb="24px">
            <LocalOffer fontSize="large" sx={{ color: "#C8A846" }} />
            <Typography variant="h4" color="text.primary">
              {t("discount.discountVoucher")}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb="24px">
            {t("discount.discountVoucherDescription")}
          </Typography>
          <Box mb="24px">
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">Sort by</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort by"
                onChange={(event) => setSortBy(event.target.value as SortBy)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 8 } }}
              >
                <MenuItem value={SortBy.NEWEST}>Newest</MenuItem>
                <MenuItem value={SortBy.OLDEST}>Oldest</MenuItem>
                <MenuItem value={SortBy.VALUE}>Value</MenuItem>
                <MenuItem value={SortBy.EXPIRY}>Expiry</MenuItem>
                <MenuItem value={SortBy.USAGE}>Usage</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={1} className="mb-6">
        <CardContent>
          <Box className="flex gap-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("discount.enterVoucherCode")}
              
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#C8A846',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C8A846',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchDiscount}
              className="bg-[#C8A846] hover:bg-[#ae923e] px-8"
              startIcon={<LocalOffer />}
            >
              {t("discount.save")}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={1} className="mb-6">
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: '#C8A846 !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#C8A846',
            },
          }}
        >
          {categories?.map((category) => {
            const IconComponent = category.icon;
            return (
              <Tab
                key={category.id}
                value={category.id}
                label={
                  <Box className="flex items-center gap-2">
                    <IconComponent fontSize="small" />
                    {category.name} ({category.count})
                  </Box>
                }
              />
            );
          })}
        </Tabs>
      </Card>

      <Grid container spacing={3}>
        {filteredAndSortedDiscounts?.map((discount: DiscountInterface) => (
          <Grid key={discount.id}>
            <Card elevation={2} className="h-full hover:shadow-lg transition-shadow">
              <CardContent>
                <Box className="flex gap-4">
                  <Box
                    className="w-16 h-16 rounded-lg flex items-center justify-center relative"
                    sx={{
                      background: 'linear-gradient(135deg, #C8A846 0%, #d4b851 100%)',
                    }}
                  >
                    {getDiscountIcon(discount.discountType)}
                    {isExpiringSoon(discount.expireAt) && (
                      <Chip
                        label="Hot"
                        color="error"
                        size="small"
                        className="absolute -top-2 -right-2"
                      />
                    )}
                  </Box>

                  <Box className="flex-1">
                    <Box className="flex justify-between items-start mb-2">
                      <Box>
                        <Typography variant="h6" className="font-bold text-[#C8A846]">
                          {getDiscountLabel(discount)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {discount.name}
                        </Typography>
                      </Box>
                      {isExpiringSoon(discount.expireAt) && (
                        <Chip
                          icon={<AccessTime />}
                          label={t("discount.expiringSoon")}
                          color="warning"
                          size="small"
                        />
                      )}
                    </Box>

                    <Typography variant="body2" className="mb-3">
                      {discount.description}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" className="mb-3">
                      {getThresholdText(discount.thresholdAmount)}
                    </Typography>

                    <Stack direction="row" spacing={2} className="mb-3">
                      <Box className="flex items-center gap-1">
                        <People fontSize="small" className="text-gray-500" />
                        <Typography variant="caption">
                          {discount.userDiscounts?.length}/{discount.usageLimit}
                        </Typography>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <CalendarToday fontSize="small" className="text-gray-500" />
                        <Typography variant="caption">
                          {formatDate(discount.expireAt.toString())}
                        </Typography>
                      </Box>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        ((discount.userDiscounts?.length || 0) / discount.usageLimit) * 100,
                        100
                      )}
                      className="mb-3"
                      sx={{
                        backgroundColor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#C8A846',
                        },
                      }}
                    />

                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleApplyDiscount()}
                        className="bg-[#C8A846] hover:bg-[#ae923e]"
                      >
                        {t("discount.useNow")}
                      </Button>
                      <Tooltip title="Copy Code">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(discount.slug)}
                        >
                          <ContentCopy fontSize="small" onClick={() => copyToClipboard(discount.slug)} />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Box className="mt-2">
                      <Typography variant="caption" color="text.secondary">
                        <CountdownTimer expireAt={discount?.expireAt} />
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredAndSortedDiscounts?.length === 0 && (
        <Card elevation={1} className="text-center py-12">
          <CardContent>
            <LocalOffer className="text-gray-300 mb-4" sx={{ fontSize: 64 }} />
            <Typography variant="h6" color="text.secondary" className="mb-2">
              {t("discount.noVoucherFound")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("discount.tryChangingYourSearchTermsOrFiltersToFindMoreVouchers")}
            </Typography>
          </CardContent>
        </Card>
      )}

      {filteredAndSortedDiscounts?.length < total && (
        <Box className="text-center mt-8">
          <Button
            variant="outlined"
            size="large"
            className="text-[#C8A846] border-[#C8A846] hover:bg-[#C8A846] hover:text-white px-8"
          >
            {t("discount.loadMoreVouchers")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DiscountVoucherPage;
