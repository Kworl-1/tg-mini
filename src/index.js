import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <script async src="https://core.telegram.org/js/telegram-web-app.js"></script>
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
