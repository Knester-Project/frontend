import axios, { type AxiosInstance } from "axios";

//Libs, Enums
import { getAccessToken, getAdminAccessToken } from "@/lib/token";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAxiosAuthInstance = (type: 'user' | 'admin' = 'user'): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // Attach the correct token
  instance.interceptors.request.use(
    async (config) => {
      const token = type === 'admin' ? getAdminAccessToken() : getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};


// Axios instance for unauthenticated requests
export const axiosUnauthInstance = axios.create({
    baseURL: BASE_URL,
});