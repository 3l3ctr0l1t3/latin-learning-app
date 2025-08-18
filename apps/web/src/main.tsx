import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Registrar el Service Worker para PWA
// Esto permite que la app funcione offline y sea instalable
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/latin-learning-app/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado exitosamente:', registration);
      })
      .catch((error) => {
        console.log('Error al registrar Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
