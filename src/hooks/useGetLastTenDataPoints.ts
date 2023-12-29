// hooks/useGetLastTenDataPoints.ts
import useSWR from 'swr';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';

export function useGetLastTenDataPoints() {
    const { getToken } = useAuth();

    const fetcher = async (url: string) => {
      const token = await getToken();
      return fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json());
    };
    const { user } = useClerk();
    const clerkId = user?.id;

    const { data, error } = useSWR(`/api/db/data/getLastTenDataPoints?clerkId=${clerkId}`, fetcher);


    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
} 
