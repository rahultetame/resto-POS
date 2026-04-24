import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import PrivateRoute from './routes/PrivateRoute';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import RestaurantSetupWizard from './modules/restaurant-layout/RestaurantSetupWizard';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/setup" element={<RestaurantSetupWizard />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
