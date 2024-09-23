import axios from "axios";
import { getToken } from "./token";

axios.defaults.baseURL = import.meta.env.VITE_HOST_API;

axios.interceptors.request.use(
  (request) => {
    const token = getToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axios;
