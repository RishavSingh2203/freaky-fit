import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import { AppRoutes } from './routes';
import { ThemeProvider } from './components/theme-provider';
import { PWAStatus } from './components/PWAStatus';
import { InstallPrompt } from './components/InstallPrompt';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AppRoutes />
  );
}

export default App;
