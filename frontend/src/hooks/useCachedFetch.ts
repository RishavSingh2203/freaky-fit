import { useState, useEffect } from 'react';

interface UseCachedFetchOptions {
  skipCache?: boolean;     // Skip cache even if available and fetch from network
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isFromCache: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook for fetching data
 * 
 * @param url The URL to fetch data from
 * @param options Configuration options for the fetch operation
 * @returns Object containing data, loading state, error, and refresh function
 */
export function useCachedFetch<T>(
  url: string, 
  options: UseCachedFetchOptions = {}
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);

  const { 
    skipCache = false
  } = options;

  const fetchData = async (skipCacheOverride = false) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch from network
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      
      // Save the fetched data
      setData(result);
      setIsFromCache(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh the data
  const refresh = async () => {
    await fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, isFromCache, refresh };
}