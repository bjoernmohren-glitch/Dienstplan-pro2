

// RICHTIG: Zeigt auf 'App.jsx'
import App from './App.jsx'; // <-- KORREKTUR

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
try{ if (typeof Main !== "undefined") window.Main = Main; }catch(e){}
