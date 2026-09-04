import axios, { type AxiosError, type AxiosInstance } from "axios";

// Store
import { getCsrfToken } from "@/stores/csrf.store";
import { sileo } from "sileo";

// Base URL for the API
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAxiosAuthInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // Request interceptor
  instance.interceptors.request.use(
    async (config) => {
      const method = config.method?.toUpperCase();

      // CSRF protection for state-changing requests
      if (["POST", "PUT", "PATCH", "DELETE"].includes(method ?? "")) {
        const token = await getCsrfToken();

        if (token) {
          config.headers.set("x-csrf-token", token);
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,

    (error: AxiosError<{ message?: string }>) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      const unauthorizedMessages = [
        "Invalid token payload",
        "Session expired due to inactivity. Please log in again.",
        "Your last login was 30 days ago. Please log in again to verify your identity.",
        "Unauthorized",
      ];

      if (status === 419 && unauthorizedMessages.includes(message ?? "")) {
        sileo.error({
          title: "Your session has expired. Please login again.",
        });

        // Prevent redirect loop
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};