import { useEffect, useState } from 'react';
import { isAppInstalled, isInstallSupported } from '../lib/pwa-utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isAppInstalled());
  const [dismissed, setDismissed] = useState(localStorage.getItem('pwa-install-dismissed') === 'true');

  useEffect(() => {
    // Check if already installed
    if (isAppInstalled()) {
      setIsInstalled(true);
      return;
    }

    // Save the install prompt event for later use
    const savePrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', savePrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', savePrompt);
    };
  }, []);

  // Don't show if already installed, dismissed, or can't be installed
  if (isInstalled || dismissed || !isInstallSupported() || !installPrompt) {
    return null;
  }

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 text-2xl">📱</div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Install BodyMind AI</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Install our app for a better experience with offline access and faster load times.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleInstall}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 