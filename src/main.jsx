import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Mensajes de diagnóstico para la consola (F12)
console.log("--- Diagnóstico de Arranque ---");
console.log("URL de Supabase configurada:", import.meta.env.VITE_SUPABASE_URL ? "SÍ" : "NO");
console.log("Key de Supabase configurada:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "SÍ" : "NO");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Error crítico: No se encontró el elemento #root en el HTML");
} else {
  ReactDOM.createRoot(rootElement).render(
    <App />
  );
}