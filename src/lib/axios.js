import Axios from "axios";
import { token } from "./token";

export const axios = new Axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

axios.interceptors.request.use((request) => {
  const tokenApp = token.getToken();
  if (tokenApp) {
    request.headers["verification"] = tokenApp;
  }

  //request.headers["Content-Type"] = "application/json";
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    if (error?.response?.status === 502) {
      token.clearToken();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);
