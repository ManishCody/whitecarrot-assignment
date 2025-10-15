import useSWR from 'swr';
import { axiosInstance } from '@/lib/axios';

const fetcher = (url: string) => axiosInstance.get(url).then(res => res.data);

export function useCompanies(page: number, searchQuery: string) {
  const endpoint = searchQuery.length > 1
    ? `/api/search/companies?q=${searchQuery}`
    : `/api/companies/discover?page=${page}`;

  const { data, error, mutate } = useSWR(endpoint, fetcher, {
    dedupingInterval: 5 * 60 * 1000,
    focusThrottleInterval: 60 * 1000,
    keepPreviousData: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return {
    companies: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
