import useSWR from 'swr';

export function useGetAllAveragePoints(schemaId: string | null) {
    const fetcher = async (url: string) => {
        return fetch(url).then((res) => res.json());
    };

    const { data, error } = useSWR(schemaId ? `/api/db/data/getAllAveragePoints?schemaId=${schemaId}` : null, fetcher);

    return {
        data,
        isLoading: !error && !data,
        isError: error,
    };
}