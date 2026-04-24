import { lazy } from 'react';

export const LazyPath = {
  Login: lazy(() => import('../pages/auth/Login')),
  Register: lazy(() => import('../pages/auth/Register')),
  Dashboard: lazy(() => import('../pages/dashboard/Dashboard')),
  OrderScreen: lazy(() => import('../pages/pos/OrderScreen')),
  KioskScreen: lazy(() => import('../pages/kiosk/KioskScreen')),

  // ✅ ADD THIS
  RestaurantLayout: lazy(() => import('../layouts/restaurant-layout')),
};
