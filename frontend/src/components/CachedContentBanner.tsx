interface CachedContentBannerProps {
  isFromCache: boolean;
  timestamp?: number;
  onRefresh?: () => void;
}

export function CachedContentBanner({ isFromCache, timestamp, onRefresh }: CachedContentBannerProps) {
  // Only show when viewing cached content
  if (!isFromCache) return null;

  // Format the timestamp if provided
  const cachedTime = timestamp 
    ? new Date(timestamp).toLocaleString()
    : 'earlier';

  return (
    <div className="bg-amber-50 dark:bg-amber-900 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 text-amber-400">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-amber-700 dark:text-amber-200">
            You're viewing cached content from {cachedTime}.
          </p>
          {onRefresh && (
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <button
                onClick={onRefresh}
                className="whitespace-nowrap font-medium text-amber-700 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-100"
              >
                Refresh
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}