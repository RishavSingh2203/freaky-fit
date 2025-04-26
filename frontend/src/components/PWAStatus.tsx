import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function PWAStatus() {
  const [needRefresh, setNeedRefresh] = useState(false);
  
  // Setup the service worker
  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    }
  });

  const close = () => {
    setNeedRefresh(false);
  };

  const refresh = () => {
    updateServiceWorker(true);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {needRefresh && (
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <p className="flex items-center">
              <span className="mr-2">🔄</span>
              New content available
            </p>
            <div className="flex space-x-2">
              <button 
                onClick={refresh} 
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Reload
              </button>
              <button 
                onClick={close}
                className="text-blue-800 hover:text-blue-900"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}