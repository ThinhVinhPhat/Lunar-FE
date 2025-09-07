import { Box, Chip, LinearProgress, Divider, Stack, Typography } from "@mui/material";
import Text from "../../shared/components/wrapper/Text";
import { Order } from "@/shared/types/order";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ClearIcon from '@mui/icons-material/Clear';
import { DiscountValueType } from "@/shared/types/discount";

type CartHeaderProps = {
    cart: Order | null,
    handleDeleteDiscountFromOrder: (discountId: string) => void
}

export default function CartHeader({ cart, handleDeleteDiscountFromOrder }: CartHeaderProps) { 
      const freeShippingThreshold = 99;
      const freeShippingRemaining = freeShippingThreshold - (cart?.finalPrice ?? 0);
    return (
      <>
          
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
      {freeShippingRemaining > 0 ? (
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            <Text id="cart.youre" />{" "}
            <Typography component="span" fontWeight="bold">
              ${freeShippingRemaining.toFixed(2)}
            </Typography>{" "}
            <Text id="cart.away_from_free_us_shipping" />
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(cart?.finalPrice ?? 0 / freeShippingThreshold) * 100}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#C8A846',
              },
            }}
          />
        </Box>
      ) : (
        <Typography variant="body2" color="success.main" fontWeight="medium">
          🎉 <Text id="cart.youve_qualified_for_free_us_shipping" />!
        </Typography>
      )}
    </Box>

    <Divider />

    {cart?.discounts && cart?.discounts.length > 0 && (
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          <Text id="cart.applied_discounts" />:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {cart?.discounts.map((discount) => (
            <Chip
              key={discount.id}
              icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
              label={`${discount.valueType === DiscountValueType.PERCENTAGE ? `${discount.value}%` : `$${discount.value}`} OFF`}
              onDelete={() => handleDeleteDiscountFromOrder(discount.id)}
              deleteIcon={<ClearIcon sx={{ fontSize: 16 }} />}
              size="small"
              sx={{
                backgroundColor: '#C8A846',
                color: 'white',
                '& .MuiChip-deleteIcon': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    color: 'white',
                  },
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    )}
      </>
    );
}