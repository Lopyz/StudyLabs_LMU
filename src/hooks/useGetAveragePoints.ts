import useSWR from 'swr';
import { useAuth } from '@clerk/nextjs';

export function useGetAveragePoints(schemaId: string | null) {
    const { getToken } = useAuth();

    const fetcher = async (url: string) => {
        const token = await getToken();
        return fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json());
    };

    const { data, error } = useSWR(schemaId ? `/api/db/data/getAveragePoints?schemaId=${schemaId}` : null, fetcher);

    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
}