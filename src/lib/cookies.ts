"use client";

export type CookieSetOptions = {
  days?: number; 
  path?: string;
};

export function setCookie(name: string, value: string, options: CookieSetOptions = {}) {
  if (typeof document === "undefined") return;
  const { days = 7, path = "/" } = options;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Expires=${expires}; Path=${path}; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const key = encodeURIComponent(name) + "=";
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(key)) {
      return decodeURIComponent(part.substring(key.length));
    }
  }
  return null;
}

export function deleteCookie(name: string, path: string = "/") {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}; SameSite=Lax`;
}
