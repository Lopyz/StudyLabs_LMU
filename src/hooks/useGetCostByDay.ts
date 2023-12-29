// hooks/useGetCostByDay.ts
import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';

export function useGetCostByDay() {
    const { getToken } = useAuth();

    const fetcher = async (url: string) => {
      const token = await getToken();
      return fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());
    };
    const { data, error } = useSWR(`/api/db/data/getCostByDay`, fetcher);
    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
} 
