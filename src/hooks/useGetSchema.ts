import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';

export function useGetSchema() {
  const { getToken } = useAuth();

  const fetcher = async (url: string) => {
    const token = await getToken();
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
  };
  const router = useRouter();
  const { schemaId } = router.query;

  const swrKey = router.isReady ? `/api/db/schema/getByID?id=${schemaId}` : null;
  
  const { data, error } = useSWR(swrKey, fetcher);

  return {
    data: data ? data : null,
    isLoading: !error && !data,
    isError: error,
  };
}
