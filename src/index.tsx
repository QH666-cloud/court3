import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // We are using Tailwind CDN but this is standard pattern

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)