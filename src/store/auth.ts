"use client";

import { create, type StateCreator } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { axiosInstance } from "@/lib/axios";

export type AuthUser = {
  id?: string;
  name?: string;
  email: string;
  role: string;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: { user: AuthUser }) => void;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
};


const creator: StateCreator<AuthState> = (set, _get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    login: ({ user }) => {
      set({
        user,
        isAuthenticated: true,
      });
    },
    logout: async () => {
      try {
        await axiosInstance.post("/api/auth/logout");
      } catch (_error) {
        console.error("Logout failed");
      } finally {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    },
    checkUser: async () => {
      try {
        const { data } = await axiosInstance.get("/api/auth/me");
        set({ user: data, isAuthenticated: true, loading: false });
      } catch (_error) {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    },
});

export const useAuthStore = create<AuthState>()(subscribeWithSelector(creator));

if (typeof window !== "undefined") {
  setTimeout(() => {
    try {
      useAuthStore.getState().checkUser();
    } catch {}
  }, 0);
}
