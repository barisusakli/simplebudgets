import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles.scss';
import App from './app';
import { AlertProvider } from './contexts/AlertContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<AlertProvider >
		<App />
	</AlertProvider>
);

if ('serviceWorker' in navigator && navigator.serviceWorker) {
	navigator.serviceWorker.register('./service-worker.js', { scope: '/' })
		.then(() => {
			console.info('ServiceWorker registration succeeded.');
		}).catch((err) => {
			console.info('ServiceWorker registration failed: ', err);
		});
}
