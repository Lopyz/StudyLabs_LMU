// hooks/useGetAllFiles
import useSWR, { mutate } from 'swr';
import { useAuth } from '@clerk/nextjs';

export function useGetAllFiles() {
  const { getToken } = useAuth();

  const fetcher = async (url: string) => {
    const token = await getToken();
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
  };

  const { data, error } = useSWR(`/api/db/project/getAll`, fetcher);

  const revalidateData = () => {
    mutate(`/api/db/project/getAll`);
  };

  return {
    data: data ? data.data : null,
    isLoading: !error && !data,
    isError: error,
    revalidateData,
  };
}
