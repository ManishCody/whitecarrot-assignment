"use client";

import { create, type StateCreator } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

export type AuthUser = {
  id?: string;
  name?: string;
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { email: string; token: string; name?: string; id?: string }) => void;
  logout: () => void;
  hydrateFromCookies: () => void;
};

const TOKEN_KEY = "wc_auth_token";
const EMAIL_KEY = "wc_auth_email";
const NAME_KEY = "wc_auth_name";
const ID_KEY = "wc_auth_id";

const creator: StateCreator<AuthState> = (set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: ({ email, token, name, id }) => {
      set({
        token,
        user: { email, name, id },
        isAuthenticated: true,
      });
      setCookie(TOKEN_KEY, token, { days: 7 });
      setCookie(EMAIL_KEY, email, { days: 7 });
      if (name) setCookie(NAME_KEY, name, { days: 7 });
      if (id) setCookie(ID_KEY, id, { days: 7 });
    },
    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
      deleteCookie(TOKEN_KEY);
      deleteCookie(EMAIL_KEY);
      deleteCookie(NAME_KEY);
      deleteCookie(ID_KEY);
    },
    hydrateFromCookies: () => {
      const token = getCookie(TOKEN_KEY);
      const email = getCookie(EMAIL_KEY);
      const name = getCookie(NAME_KEY) ?? undefined;
      const id = getCookie(ID_KEY) ?? undefined;
      if (token && email) {
        set({ token, user: { email, name, id }, isAuthenticated: true });
      }
    },
});

export const useAuthStore = create<AuthState>()(subscribeWithSelector(creator));

if (typeof window !== "undefined") {
  setTimeout(() => {
    try {
      useAuthStore.getState().hydrateFromCookies();
    } catch {}
  }, 0);
}
