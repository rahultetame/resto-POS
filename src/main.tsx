import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import ErrorBoundary from './components/popups/ErrorBoundary';
import { AppThemeProvider } from './contexts/AppThemeProvider';
import { store } from './store';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }} maxSnack={3}>
          <ErrorBoundary>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ErrorBoundary>
        </SnackbarProvider>
      </AppThemeProvider>
    </Provider>
  </React.StrictMode>,
);
