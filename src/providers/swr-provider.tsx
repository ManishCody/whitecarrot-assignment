"use client";

import { SWRConfig } from 'swr';
import { axiosInstance } from '@/lib/axios';

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        // Global cache settings
        dedupingInterval: 2000,
        focusThrottleInterval: 5000,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        // Keep data fresh
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        // Performance optimizations
        keepPreviousData: true,
        // Cache for 10 minutes by default
        refreshInterval: 10 * 60 * 1000,
        // Fallback data while loading
        fallbackData: undefined,
        // Error handling
        onError: (error) => {
          console.error('SWR Error:', error);
        },
        // Success handling
        onSuccess: (data, key) => {
          // Optional: Log successful requests in development
          if (process.env.NODE_ENV === 'development') {
            console.log('SWR Success:', key, data);
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
