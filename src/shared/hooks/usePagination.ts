import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
    initialPage?: number;
    initialLimit?: number;
    maxLimit?: number;
}

interface UsePaginationReturn {
    page: number;
    limit: number;
    offset: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    handlePageChange: (newPage: number) => void;
    handleLimitChange: (newLimit: number) => void;
    goToFirstPage: () => void;
    goToLastPage: () => void;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    resetPagination: () => void;
    setTotalItems: (total: number) => void;
}

export default function usePagination({
    initialPage = 1,
    initialLimit = 10,
    maxLimit = 100
}: UsePaginationProps = {}): UsePaginationReturn {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [totalItems, setTotalItems] = useState(0);
    
    const offset = useMemo(() => (page - 1) * limit, [page, limit]);
    const totalPages = useMemo(() => Math.ceil(totalItems / limit), [totalItems, limit]);
    const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
    const hasPreviousPage = useMemo(() => page > 1, [page]);
    
    const handlePageChange = useCallback((newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [totalPages]);
    
    const handleLimitChange = useCallback((newLimit: number) => {
        if (newLimit > 0 && newLimit <= maxLimit) {
            setLimit(newLimit);
            setPage(1); // Reset to first page when limit changes
        }
    }, [maxLimit]);
    
    const goToFirstPage = useCallback(() => {
        handlePageChange(1);
    }, [handlePageChange]);
    
    const goToLastPage = useCallback(() => {
        handlePageChange(totalPages);
    }, [handlePageChange, totalPages]);
    
    const goToNextPage = useCallback(() => {
        if (hasNextPage) {
            handlePageChange(page + 1);
        }
    }, [hasNextPage, handlePageChange, page]);
    
    const goToPreviousPage = useCallback(() => {
        if (hasPreviousPage) {
            handlePageChange(page - 1);
        }
    }, [hasPreviousPage, handlePageChange, page]);
    
    const resetPagination = useCallback(() => {
        setPage(initialPage);
        setLimit(initialLimit);
    }, [initialPage, initialLimit]);
    
    return {
        page,
        limit,
        offset,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        handlePageChange,
        handleLimitChange,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPreviousPage,
        resetPagination,
        setTotalItems,
    };
}
