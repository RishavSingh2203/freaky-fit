/**
 * PWA utility functions for the BodyMind AI app
 */

/**
 * Checks if the app is installed (running in standalone mode)
 * @returns boolean indicating if the app is installed
 */
export function isAppInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
}

/**
 * Detects if the browser supports PWA installation
 * @returns boolean indicating if installation is supported
 */
export function isInstallSupported(): boolean {
  return 'serviceWorker' in navigator && 
    'PushManager' in window &&
    navigator.serviceWorker !== undefined;
}