import { Order, OrderStatus } from "@/shared/types/order";
import Text from "@/shared/components/wrapper/Text";
import usePagination from "@/shared/hooks/usePagination";
import { Pagination } from "@/shared/components/Pagination";
import { useGetOrderList } from "@/lib/hooks/queryClient/query/order/order.query";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
  Stack,
  Grid,
  Avatar,
  LinearProgress,
  Skeleton,
  Container,
  alpha,
} from "@mui/material";
import {
  ShoppingBag,
  CalendarToday,
  AttachMoney,
  Visibility,
  LocalShipping,
  Receipt,
  Timeline,
  CheckCircle,
  Pending,
  Cancel,
  Inventory,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { formatCurrency } from "@/lib/ultis/formatCurrency";
import { useNavigate } from "react-router-dom";
const HeaderContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#C8A846', 0.1)} 0%, ${alpha('#C8A846', 0.05)} 100%)`,
  borderRadius: '20px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  border: `1px solid ${alpha('#C8A846', 0.2)}`,
  backdropFilter: 'blur(10px)',
}));

const OrderCard = styled(Card)(() => ({
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `1px solid ${alpha('#C8A846', 0.1)}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${alpha('#C8A846', 0.15)}`,
    borderColor: alpha('#C8A846', 0.3),
  },
}));

const StatusTimeline = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: alpha('#C8A846', 0.05),
  borderRadius: '12px',
  border: `1px solid ${alpha('#C8A846', 0.1)}`,
}));

function OrderHistory() {
  const { page, handlePageChange, setTotalItems } = usePagination();
  const { data: orderList, total, isLoading } = useGetOrderList("Confirmed", page, 10);
  const navigate = useNavigate();
  useEffect(() => {
    if (total) {
      setTotalItems(total);
    }
  }, [total, setTotalItems]);

  const handlePaginationChange = (newPage: number) => {
    handlePageChange(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'delivered':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'delivered':
        return <LocalShipping />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Receipt />;
    }
  };


  const getStatusPercent = (status: string) => {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return 25;
      case OrderStatus.PENDING:
        return 50;
      case OrderStatus.DELIVERED:
        return 75;
      case OrderStatus.REJECTED:
        return 100;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <HeaderContainer>
          <Skeleton variant="text" width={300} height={40} />
        </HeaderContainer>
        <Stack spacing={3}>
          {[1, 2, 3].map((item) => (
            <Card key={item} sx={{ borderRadius: '16px' }}>
              <CardContent>
                <Skeleton variant="text" width="100%" height={30} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="rectangular" width="100%" height={80} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <HeaderContainer>
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Box className="flex items-center gap-3">
              <Avatar
                sx={{
                  bgcolor: '#C8A846',
                  width: 48,
                  height: 48,
                }}
              >
                <Timeline />
              </Avatar>
              <Box>
                <Typography variant="h4" className="font-bold text-[#C8A846]">
                  <Text id="order_history.order_history" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <Text id="order_history.track_your_orders_and_purchase_history" />
                </Typography>
              </Box>
            </Box>
            
            <Box className="flex items-center gap-3">
              <Chip
                label={`${total || 0} orders`}
                variant="outlined"
                sx={{
                  borderColor: '#C8A846',
                  color: '#C8A846',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </HeaderContainer>

        <AnimatePresence mode="wait">
          {orderList && orderList.length > 0 ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Stack spacing={3}>
                {orderList?.map((order: Order, index: number) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <OrderCard elevation={0}>
                      <CardContent sx={{ p: 3 }}>
                        <Box className="flex justify-between items-start mb-4">
                          <Box className="flex items-center gap-3">
                            <Avatar
                              sx={{
                                bgcolor: alpha('#C8A846', 0.1),
                                color: '#C8A846',
                                width: 40,
                                height: 40,
                              }}
                            >
                              <Receipt />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" className="font-semibold">
                                <Text id="order_history.order" /> #{order.id}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box className="flex items-center gap-2">
                            <StatusTimeline>
                              {getStatusIcon('confirmed')}
                              <Chip
                                label={<Text id="order_history.confirmed" />}
                                color={getStatusColor('confirmed')}
                                size="small"
                                variant="filled"
                              />
                            </StatusTimeline>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={3} sx={{ mb: 3 }}>
                          <Grid>
                            <Box className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100">
                              <Avatar sx={{ bgcolor: '#2196F3', width: 36, height: 36 }}>
                                <CalendarToday fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" color="text.secondary" className="font-medium">
                                  <Text id="order_history.date" />
                                </Typography>
                                <Typography variant="body1" className="font-semibold">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid>
                            <Box className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100">
                              <Avatar sx={{ bgcolor: '#C8A846', width: 36, height: 36 }}>
                                <AttachMoney fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" color="text.secondary" className="font-medium">
                                  <Text id="order_history.total" />
                                </Typography>
                                <Typography variant="body1" className="font-semibold text-[#C8A846]">
                                  {formatCurrency((order.total_price || 0) + (order.shippingFee || 0))}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid>
                            <Box className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100">
                              <Avatar sx={{ bgcolor: '#9C27B0', width: 36, height: 36 }}>
                                <Inventory fontSize="small" />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" color="text.secondary" className="font-medium">
                                  <Text id="order_history.items" />
                                </Typography>
                                <Typography variant="body1" className="font-semibold">
                                  {total || 0} items
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box sx={{ mb: 3 }}>
                          <Box className="flex justify-between items-center mb-2">
                            <Typography variant="body2" color="text.secondary">
                              <Text id="order_history.order_progress" />
                            </Typography>
                            <Typography variant="body2" className="font-semibold text-[#C8A846]">
                              {getStatusPercent(order?.orderTracks?.[order.orderTracks.length - 1]?.status)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={getStatusPercent(order?.orderTracks?.[order.orderTracks.length - 1]?.status)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: alpha('#C8A846', 0.1),
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#C8A846',
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>

                        <Box className="flex justify-end gap-2">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => navigate(`/order/${order.id}`)}
                            sx={{
                              borderColor: '#C8A846',
                              color: '#C8A846',
                              '&:hover': {
                                backgroundColor: '#C8A846',
                                color: 'white',
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 8px ${alpha('#C8A846', 0.3)}`,
                              },
                              transition: 'all 0.3s',
                            }}
                          >
                            <Text id="order_history.view_details" />
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<LocalShipping />}
                            sx={{
                              backgroundColor: '#C8A846',
                              '&:hover': {
                                backgroundColor: '#ae923e',
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 8px ${alpha('#C8A846', 0.4)}`,
                              },
                              transition: 'all 0.3s',
                            }}
                          >
                            <Text id="order_history.track_order" />
                          </Button>
                        </Box>
                      </CardContent>
                    </OrderCard>
                  </motion.div>
                ))}
              </Stack>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  productCount={total || 0}
                  currentPage={page}
                  onSetPage={handlePaginationChange}
                  limit={10}
                  variant="detailed"
                  showItemsPerPage={false}
                />
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Card 
                elevation={0} 
                sx={{
                  textAlign: 'center',
                  py: 8,
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${alpha('#C8A846', 0.05)} 0%, ${alpha('#C8A846', 0.02)} 100%)`,
                  border: `1px solid ${alpha('#C8A846', 0.1)}`,
                }}
              >
                <CardContent>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha('#C8A846', 0.1),
                        color: '#C8A846',
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <ShoppingBag sx={{ fontSize: 40 }} />
                    </Avatar>
                  </motion.div>
                  
                  <Typography variant="h5" className="font-bold text-[#C8A846] mb-2">
                    <Text id="order_history.you_dont_have_any_orders_yet" />
                  </Typography>
                  <Typography variant="body1" color="text.secondary" className="mb-6 max-w-md mx-auto">
                    <Text id="order_history.start_shopping_to_see_your_orders_here" />
                  </Typography>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingBag />}
                      sx={{
                        backgroundColor: '#C8A846',
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#ae923e',
                          boxShadow: `0 8px 16px ${alpha('#C8A846', 0.3)}`,
                        },
                        transition: 'all 0.3s',
                      }}
                    >
                      <Text id="order_history.shop_now" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
}

export default OrderHistory;
