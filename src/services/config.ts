import axios, { type AxiosInstance } from "axios";

// Store
import { getCsrfToken } from "@/stores/csrf.store";

// Base URL for the API
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAxiosAuthInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // Add a request interceptor
  instance.interceptors.request.use(async (config) => {
    const method = config.method?.toUpperCase();

    // Check if the method is POST, PUT, PATCH, or DELETE
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method!)) {
      const token = await getCsrfToken();

      // Attach the CSRF token to the request headers if available
      if (token) {
        config.headers["x-csrf-token"] = token;
      }
    }

    return config;
  });

  return instance;
};