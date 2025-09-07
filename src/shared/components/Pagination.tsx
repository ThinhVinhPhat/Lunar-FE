import React from 'react';
import {
  Pagination as MuiPagination,
  Stack,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';

type PaginationProps = {
  productCount: number;
  currentPage: number;
  onSetPage: (page: number) => void;
  limit: number;
  onLimitChange?: (limit: number) => void;
  showItemsPerPage?: boolean;
  showPageInfo?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
};

const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    borderRadius: '12px',
    margin: '0 2px',
    fontWeight: 500,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: alpha('#C8A846', 0.1),
      transform: 'translateY(-1px)',
      boxShadow: `0 4px 8px ${alpha('#C8A846', 0.2)}`,
    },
    '&.Mui-selected': {
      backgroundColor: '#C8A846',
      color: 'white',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: '#ae923e',
        transform: 'translateY(-1px)',
        boxShadow: `0 6px 12px ${alpha('#C8A846', 0.3)}`,
      },
    },
  },
  '& .MuiPaginationItem-ellipsis': {
    color: theme.palette.text.secondary,
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#C8A846', 0.05)} 0%, ${alpha('#C8A846', 0.02)} 100%)`,
  borderRadius: '16px',
  padding: theme.spacing(2),
  border: `1px solid ${alpha('#C8A846', 0.1)}`,
  backdropFilter: 'blur(10px)',
}));

export const Pagination: React.FC<PaginationProps> = ({
  productCount,
  currentPage,
  onSetPage,
  limit,
  onLimitChange,
  showItemsPerPage = true,
  showPageInfo = true,
  variant = 'default',
}) => {
  const totalPages = Math.ceil(productCount / limit);
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, productCount);


  const handleLimitChange = (event: any) => {
    const newLimit = event.target.value as number;
    onLimitChange?.(newLimit);
  };

  if (variant === 'compact') {
    return (
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <StyledPagination
          count={totalPages}
          page={currentPage}
          onChange={(value: number) => {
            onSetPage(value);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          color="primary"
          size="small"
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>
    );
  }

  if (variant === 'detailed') {
    return (
      <PaginationContainer>
        <Stack spacing={3}>
          {showPageInfo && (
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <Box className="flex items-center gap-2">
                <Chip
                  label={`${startItem}-${endItem} of ${productCount}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#C8A846',
                    color: '#C8A846',
                    fontWeight: 600,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  items
                </Typography>
              </Box>
              
              {showItemsPerPage && onLimitChange && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: '#C8A846' }}>Items per page</InputLabel>
                  <Select
                    value={limit}
                    onChange={handleLimitChange}
                    label="Items per page"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#C8A846', 0.3),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C8A846',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C8A846',
                      },
                    }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
          
          <Box className="flex justify-center">
            <StyledPagination
              count={totalPages}
              page={currentPage}
              onChange={(value: number) => {
                onSetPage(value);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              color="primary"
              showFirstButton
              showLastButton
              siblingCount={2}
              boundaryCount={2}
            />
          </Box>
        </Stack>
      </PaginationContainer>
    );
  }

  return (
    <Stack spacing={2} alignItems="center">
      {showPageInfo && (
        <Box className="flex items-center justify-between w-full">
          <Typography variant="body2" color="text.secondary">
            Showing {startItem}-{endItem} of {productCount} items
          </Typography>
          
          {showItemsPerPage && onLimitChange && (
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={limit}
                onChange={handleLimitChange}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#C8A846', 0.3),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C8A846',
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      )}
      
      <StyledPagination
        count={totalPages}
        page={currentPage}
        onChange={(value: number) => onSetPage(value)}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
      />
    </Stack>
  );
};


