// hooks/useGetUserFilesClerkID.ts
import useSWR, { mutate } from 'swr';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';

export function useGetUserFilesClerkID() {
  const { getToken } = useAuth();

  const fetcher = async (url: string) => {
    const token = await getToken();
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json());
  };
  const { user } = useClerk();
  const clerkId = user?.id;
  const { data, error } = useSWR(`/api/db/project/getAllByUser?clerkId=${clerkId}`, fetcher);

  const revalidateData = () => {
    mutate(`/api/db/project/getAllByUser?clerkId=${clerkId}`);
  };

  return {
    data: data ? data.data : null,
    isLoading: !error && !data,
    isError: error,
    revalidateData 
  };
}
