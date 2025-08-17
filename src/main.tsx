import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('React version:', React.version)
// Register service worker for PWA (only in production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} else if ('serviceWorker' in navigator && import.meta.env.DEV) {
  // Unregister any existing service workers during development to avoid caching issues
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister());
  });
}

createRoot(document.getElementById("root")!).render(
  React.createElement('div', { style: { padding: '20px' } }, 
    React.createElement('h1', null, 'Direct React Test - No Components'),
    React.createElement('p', null, 'React Version: ' + React.version),
    React.createElement('p', null, 'React useState: ' + typeof React.useState)
  )
);
