import routes from '@/routes';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetPageName() {
  const { data, error } = useSWR('/api/db/schema/getAll', fetcher, {
    revalidateOnFocus: false
  });

  return {
    schemas: data ? data.data : null,
    isLoading: !error && !data,
    isError: error,
  };
}

export function getBrandText(pathname: string, schemas: any[] | null): string {
  if (!pathname) return '';

  if (pathname.startsWith('/einzelverarbeitung/')) {
    if (!schemas) return 'Loading...';

    const schemaId = pathname.split('/einzelverarbeitung/')[1];
    const schema = schemas.find((s) => s._id.toString() === schemaId);

    return schema?.name || 'Loading...';
  }

  // Spezifische Logik für /review
  if (pathname === '/review') {
    return 'Review'; // oder der korrekte Text für diese Route
  }

  // Logik für alle anderen Routen
  const matchingRoute = routes.find((route) => route.path && pathname.startsWith(route.path));
  if (matchingRoute) {
    return matchingRoute.name;
  }

  // Fallback für den Fall, dass keine Route gefunden wird
  return '';
}

export function getDynamicTitle(pathname: string, schemas: any[] | null): string {
  const baseTitle = 'StudyLabs';
  let title = baseTitle;

  if (!pathname) {
    return title;
  }
  const brandText = getBrandText(pathname, schemas);
  const matchingRoute = routes.find((route) => route.path && pathname.includes(route.path));

  if (pathname.includes('/einzelverarbeitung/') && brandText) {
    title += ` | ${brandText}`;
  } else if (matchingRoute && matchingRoute.name) {
    title += ` | ${matchingRoute.name}`;
  }

  return title;
}