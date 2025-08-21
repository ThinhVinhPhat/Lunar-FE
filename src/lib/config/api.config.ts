// API BASE URL
export const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// API Version
export const API_VERSION = "v1";

// HTTP Methods
export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// API Endpoints
export const API_URL = {
  // Authentication
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    FORGOT_PASSWORD: `/auth/forgot-password`,
    VERIFY: `/auth/verify`,
  },

  // Products
  PRODUCTS: {
    LIST: `/product`,
    DETAIL_BY_SLUG: (slug: string) => `/product/find-by-slug?slug=${slug}`,
    CREATE: `/product`,
    DELETE: (id: string) => `/product/${id}`,
    SUGGESTION: (name: string) => `/product/find-by-suggestion?name=${name}`,
  },

  // Favorites
  FAVORITES: {
    ADD: (productId: string) => `/favorite/${productId}`,
    GET_BY_USER: `/favorite/find-by-user`,
  },

  // Categories
  CATEGORIES: {
    GET_DETAIL: `/category-details`,
    LIST: (name: string, page: number, limit: number) =>
      `/category?name=${name}&page=${page}&limit=${limit}`,
    CREATE: `/category`,
    DELETE: (id: string) => `/category/${id}`,
    GET_DETAIL_BY_NAME: (name: string) =>
      `/category-details/get-by-category/${name}`,
    CREATE_DETAIL: (categoryId: string) => `/category-details/${categoryId}`,
    UPDATE_DETAIL: (categoryId: string) => `/category-details/${categoryId}`,
    DELETE_DETAIL: (id: string) => `/category-details/${id}`,
  },

  // Category Details
  CATEGORY_DETAILS: {
    LIST: `/category-details`,
    GET_BY_CATEGORY: (name: string) =>
      `/category-details/get-by-category/${name}`,
    CREATE: (categoryId: string) => `/category-details/${categoryId}`,
    UPDATE: (categoryId: string) => `/category-details/${categoryId}`,
    DELETE: (id: string) => `/category-details/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: (page: number, limit: number) => `/order?page=${page}&limit=${limit}`,
    LIST_BY_STATUS: (status: string, page: number, limit: number) =>
      `/order?status=${status}&page=${page}&limit=${limit}`,
    CREATE: `/order`,
    DETAIL: (id: string) => `/order/${id}`,
    UPDATE_STATUS: (orderId: string) => `/order/update-status/${orderId}`,
    UPDATE_ADDRESS: (orderId: string) => `/order/update-address/${orderId}`,
    CANCEL: (orderId: string) => `/order/${orderId}`,
    DELETE: (orderId: string) => `/order/${orderId}`,
    SHIPMENT: (orderId: string) => `/order/shipment/${orderId}`,
  },

  // Order Details
  ORDER_DETAILS: {
    CREATE: (productId: string, orderId: string) =>
      `/order-detail?productId=${productId}&orderId=${orderId}`,
    UPDATE: (orderDetailId: string, orderId: string, productId: string) =>
      `/order-detail/${orderDetailId}?orderId=${orderId}&productId=${productId}`,
    DELETE: (orderId: string) => `/order-detail/${orderId}`,
  },

  // Users
  USERS: {
    ME: `/users/me`,
    UPDATE: `/users/update`,
    UPDATE_PASSWORD: `/users/update/update-password`,
    FIND_ALL: `/users/find-all`,
    CREATE: `/users`,
    UPDATE_BY_ADMIN: `/users/update-by-admin`,
    GET_BY_ID: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/delete/${id}`,
  },

  // Discounts
  DISCOUNTS: {
    LIST: (discountType: string, name: string, page: number, limit: number) =>
      `/discount?discountType=${discountType}&name=${name}&page=${page}&limit=${limit}`,
    GET_BY_USER: `/discount/find-by-user`,
    GET_BY_ID: (id: string) => `/discount/${id}`,
    CREATE: `/discount`,
    UPDATE: (id: string) => `/discount/${id}`,
    DELETE: (id: string) => `/discount/${id}`,
    APPLY_FOR_ORDER: (discountId: string, orderId: string) =>
      `/discount/${discountId}/order/${orderId}`,
    APPLY_FOR_USER: `/discount/user`,
    DELETE_FROM_ORDER: (discountId: string, orderId: string) =>
      `/discount/${discountId}/order/${orderId}`,
  },

  // Notifications
  NOTIFICATIONS: {
    GET_BY_USER: (page: number, limit: number) =>
      `/notifications/me?page=${page}&limit=${limit}`,
    LIST: (name: string, page: number, limit: number, roles: string[]) =>
      `/notifications?page=${page}&limit=${limit}&name=${name}&roles=${roles.join(
        ","
      )}`,
    CREATE: `/notifications`,
    UPDATE: (id: string) => `/notifications/${id}`,
    UPDATE_STATUS: (id: string) => `/notifications/update-status/${id}`,
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // Comments
  COMMENTS: {
    GET_BY_PRODUCT: (id: string) => `/comment/get-by-product/${id}`,
    GET_BY_USER: `/comment/get-by-user`,
    CREATE: (productId: string) => `/comment/${productId}`,
    DELETE: (id: string) => `/comment/${id}`,
  },

  // Analytics/Statistics
  ANALYTICS: {
    SUMMARY: `/statistic/summary`,
    COMPARE_LAST_MONTH: (
      totalOrder: number,
      totalRevenue: number,
      totalView: number,
      totalCustomer: number
    ) =>
      `/statistic/compare-last-month?totalOrder=${totalOrder}&totalRevenue=${totalRevenue}&totalView=${totalView}&totalCustomer=${totalCustomer}`,
    REVENUE: `/statistic/get-year-Revenue`,
    USER_ORDERS: (page: number, limit: number, filter: string) =>
      `/statistic/user-orders?page=${page}&limit=${limit}&filter=${filter}`,
  },

  // Payments
  PAYMENTS: {
    CREATE: (orderId: string) => `/payment/${orderId}`,
    SUCCESS: (orderId: string, sessionId: string) =>
      `/payment/success/checkout/session?order_id=${orderId}&session_id=${sessionId}`,
    FAILED: `/payment/failed/checkout/session`,
  },

  // Messages
  MESSAGES: {
    GET_CONVERSATION: (senderId: string) => `/messages/${senderId}`,
    GET_BY_USER: `/messages/me`,
  },
};
