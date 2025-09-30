"use server";

import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, API_VERSION } from "../config/api.config";

const instance = axios.create({
  baseURL: API_BASE_URL + "/api/" + API_VERSION,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");

    // Với Axios v1+, headers là AxiosHeaders, nên dùng set:
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    // Thêm API key
    const apiKey = import.meta.env.VITE_PUBLIC_API_KEY;
    if (apiKey) {
      config.headers.set("x-api-key", apiKey);
    }

    return config;
  },
  (error) => Promise.reject(error)
);



instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check nếu lỗi là do accessToken hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        const res = await instance.post("/auth/refresh-token", {
          refreshToken: refreshToken,
        });
        const newAccessToken = res.data.accessToken;
        Cookies.set("accessToken", newAccessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", res.data.refreshToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });

        // Cập nhật header và gửi lại request cũ
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
        return instance(originalRequest);
      } catch (refreshError) {
        // Không thể refresh -> logout
        Cookies.remove("accessToken");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
