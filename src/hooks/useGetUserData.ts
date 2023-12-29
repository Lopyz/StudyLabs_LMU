import useSWR from 'swr';
import { useClerk, useAuth } from '@clerk/nextjs';
import { useUser } from '@/contexts/userContext';
import { useEffect, useCallback } from 'react';

export function useGetUserData() {
  const { getToken } = useAuth();
  const { user } = useClerk();
  const { refetchUser, setRefetchUser } = useUser();
  const clerkId = user?.id;

  const fetcher = async (url: string) => {
    const token = await getToken();
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
  };

  const swrKey = clerkId ? `/api/db/user/getByID?clerkId=${clerkId}` : null;
  const { data, error, mutate } = useSWR(swrKey, fetcher);

  // Using useCallback to memoize revalidateData function
  const revalidateData = useCallback(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (refetchUser) {
      revalidateData();
      setRefetchUser(false);
    }
  }, [refetchUser, revalidateData, setRefetchUser]);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
