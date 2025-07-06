"use server";

import axios, { AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api/v1/",
  // baseURL: "http://localhost:3100" + "/api/v1/",
});



instance.interceptors.request.use(
  function (config) {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
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
        console.log(res);
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
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
