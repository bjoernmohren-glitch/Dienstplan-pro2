import React from 'react';
import ReactDOM from 'react-dom/client'; 
// RICHTIG: Zeigt auf 'App.jsx'
import App from './App.jsx'; // <-- KORREKTUR
import './index.css'; 

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);