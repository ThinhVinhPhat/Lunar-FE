"use server";

import axios, { AxiosRequestHeaders } from "axios";
import Cookies from 'js-cookie';


const instance = axios.create({
  baseURL: "https://jwt-be-production.up.railway.app" + '/api/v1/',
});

instance.interceptors.request.use(
  function (config) {
    const accessToken= Cookies.get('accessToken');
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
    } as AxiosRequestHeaders;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default instance;
