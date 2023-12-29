// hooks/useGetLastFiveDataPoints.ts
import useSWR, { mutate } from 'swr';
import { useClerk } from '@clerk/nextjs';
import { useUser } from '@/contexts/userContext';
import { useAuth } from '@clerk/nextjs';

export function useGetLastFiveDataPoints() {
  const { getToken } = useAuth();

  const fetcher = async (url: string) => {
    const token = await getToken();
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
  };
    const { user } = useClerk();
    const clerkId = user?.id;
    const { refetchData,setRefetchData } = useUser(); // Zustand aus dem Kontext holen

    const { data, error, mutate } = useSWR(`/api/db/data/getLastFiveDataPoints?clerkId=${clerkId}`, fetcher);

  // Reagiere auf Änderungen in refetchUser
  const revalidateData = () => {
    mutate();
  };

  if (refetchData) {
    revalidateData();
    setRefetchData(false); // Zustand zurücksetzen
  }


    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
}
