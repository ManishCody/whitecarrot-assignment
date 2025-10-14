"use client";

import axios from "axios";
import { getCookie } from "@/lib/cookies";

const TOKEN_KEY = "wc_auth_token";

export const axiosInstance = axios.create({
  baseURL: "/",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request...
axiosInstance.interceptors.request.use((config) => {
  try {
    const token = getCookie(TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);
