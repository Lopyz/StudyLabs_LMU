// hooks/useGetAllSchemas.ts
import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';

export function useGetAllSchemas() {
  const { getToken } = useAuth();

  const fetcher = async (url: string) => {
    const token = await getToken();
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
  };
  const { data, error } = useSWR('/api/db/schema/getAll', fetcher);

  return {
    data: data ? data.data : null,
    isLoading: !error && !data,
    isError: error,
  };
}