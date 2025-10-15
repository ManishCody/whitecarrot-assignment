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
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        keepPreviousData: true,
        refreshInterval: 10 * 60 * 1000,
        fallbackData: undefined,
        onError: (error) => {
          console.error('SWR Error:', error);
        },
        onSuccess: (data, key) => {
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
